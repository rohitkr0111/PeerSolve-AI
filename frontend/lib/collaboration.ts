import * as Y from "yjs";
import { Awareness, encodeAwarenessUpdate, applyAwarenessUpdate } from "y-protocols/awareness";
import { MonacoBinding } from "./y-monaco";
import type * as monaco from "monaco-editor";
import type { CollaboratorPresence, ConnectionStatus } from "@/types/collaboration";
import type { CollaborationChatMessage } from "@/types/collaboration";

const COLLAB_COLORS = [
  "#c9f36a", // PeerSolve lime
  "#ff765f", // PeerSolve coral
  "#38bdf8", // Sky blue
  "#fbbf24", // Amber
  "#a78bfa", // Purple
  "#34d399", // Emerald
  "#f472b6", // Pink
];

export function getUserColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return COLLAB_COLORS[Math.abs(hash) % COLLAB_COLORS.length];
}

export function getWebSocketUrl(sessionId: string, userId: string, name: string): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8082";
  const wsProtocol = apiUrl.startsWith("https") ? "wss:" : "ws:";
  const host = apiUrl.replace(/^https?:\/\//, "");
  return `${wsProtocol}//${host}/ws/collaboration?sessionId=${encodeURIComponent(sessionId)}&userId=${encodeURIComponent(userId)}&name=${encodeURIComponent(name)}`;
}

function updateCursorStyles(awareness: Awareness) {
  if (typeof document === "undefined") return;
  let styleEl = document.getElementById("yjs-monaco-cursor-styles") as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "yjs-monaco-cursor-styles";
    document.head.appendChild(styleEl);
  }

  const states = awareness.getStates();
  let css = "";
  states.forEach((state, clientId) => {
    if (state.user && state.user.color) {
      const color = state.user.color;
      const name = (state.user.name || "Peer").replace(/'/g, "\\'");
      css += `
        .yRemoteSelection-${clientId} {
          background-color: ${color} !important;
        }
        .yRemoteSelectionHead-${clientId} {
          border-left-color: ${color} !important;
        }
        .yRemoteSelectionHead-${clientId}::after {
          content: '${name}';
          background-color: ${color} !important;
        }
      `;
    }
  });
  styleEl.textContent = css;
}

export interface CollaborationClientOptions {
  sessionId: string;
  userId: string;
  userName: string;
  initialCode?: string;
  onStatusChange?: (status: ConnectionStatus) => void;
  onPresenceChange?: (collaborators: CollaboratorPresence[]) => void;
  onCodeChange?: (code: string) => void;
  onChatMessage?: (message: CollaborationChatMessage) => void;
}

export class CollaborationClient {
  public readonly doc: Y.Doc;
  public readonly ytext: Y.Text;
  public readonly awareness: Awareness;
  private ws: WebSocket | null = null;
  private binding: MonacoBinding | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private destroyed: boolean = false;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private options: CollaborationClientOptions) {
    this.doc = new Y.Doc();
    this.ytext = this.doc.getText("monaco");
    this.awareness = new Awareness(this.doc);

    const userColor = getUserColor(options.userId);
    this.awareness.setLocalStateField("user", {
      id: options.userId,
      name: options.userName,
      color: userColor,
    });

    if (options.initialCode && this.ytext.length === 0) {
      this.ytext.insert(0, options.initialCode);
    }

    this.setupDocListeners();
    this.setupAwarenessListeners();
    this.connect();
  }

  private setupDocListeners() {
    this.doc.on("update", (update: Uint8Array, origin: unknown) => {
      if (origin !== "websocket" && this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "update", update: Array.from(update) }));
      }
      if (this.options.onCodeChange) {
        this.options.onCodeChange(this.ytext.toString());
      }
    });
  }

  private setupAwarenessListeners() {
    this.awareness.on("update", ({ added, updated, removed }: { added: number[]; updated: number[]; removed: number[] }, origin: unknown) => {
      const changed = added.concat(updated).concat(removed);
      if (origin !== "websocket" && this.ws && this.ws.readyState === WebSocket.OPEN) {
        const update = encodeAwarenessUpdate(this.awareness, changed);
        this.ws.send(JSON.stringify({ type: "awareness", update: Array.from(update) }));
      }
      updateCursorStyles(this.awareness);
      this.notifyPresence();
    });
  }

  private notifyPresence() {
    if (!this.options.onPresenceChange) return;
    const states = this.awareness.getStates();
    const list: CollaboratorPresence[] = [];
    states.forEach((state, clientId) => {
      if (state.user) {
        list.push({
          clientId,
          userId: state.user.id || "",
          name: state.user.name || "Peer",
          color: state.user.color || "#c9f36a",
          isLocal: clientId === this.doc.clientID,
        });
      }
    });
    this.options.onPresenceChange(list);
  }

  private connect() {
    if (this.destroyed) return;
    this.options.onStatusChange?.("connecting");

    const url = getWebSocketUrl(this.options.sessionId, this.options.userId, this.options.userName);
    try {
      this.ws = new WebSocket(url);
    } catch {
      this.options.onStatusChange?.("error");
      this.scheduleReconnect();
      return;
    }

    this.ws.onopen = () => {
      if (this.destroyed) {
        this.ws?.close();
        return;
      }
      this.options.onStatusChange?.("connected");

      // Request initial synchronization state vector
      const sv = Y.encodeStateVector(this.doc);
      this.ws?.send(JSON.stringify({ type: "sync-step-1", sv: Array.from(sv) }));

      // Send local awareness state to remote peers
      const awarenessUpdate = encodeAwarenessUpdate(this.awareness, [this.doc.clientID]);
      this.ws?.send(JSON.stringify({ type: "awareness", update: Array.from(awarenessUpdate) }));

      this.startHeartbeat();
    };

    this.ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "pong") return;

        if (msg.type === "sync-step-1" && msg.sv) {
          const remoteSv = new Uint8Array(msg.sv);
          const update = Y.encodeStateAsUpdate(this.doc, remoteSv);
          this.ws?.send(JSON.stringify({ type: "sync-step-2", update: Array.from(update) }));
          // Also broadcast local awareness so new joiner sees us
          const awarenessUpdate = encodeAwarenessUpdate(this.awareness, [this.doc.clientID]);
          this.ws?.send(JSON.stringify({ type: "awareness", update: Array.from(awarenessUpdate) }));
        } else if (msg.type === "sync-step-2" && msg.update) {
          const update = new Uint8Array(msg.update);
          Y.applyUpdate(this.doc, update, "websocket");
        } else if (msg.type === "update" && msg.update) {
          const update = new Uint8Array(msg.update);
          Y.applyUpdate(this.doc, update, "websocket");
        } else if (msg.type === "awareness" && msg.update) {
          const update = new Uint8Array(msg.update);
          applyAwarenessUpdate(this.awareness, update, "websocket");
        } else if (msg.type === "peer-joined") {
          // Re-send our awareness state
          const awarenessUpdate = encodeAwarenessUpdate(this.awareness, [this.doc.clientID]);
          this.ws?.send(JSON.stringify({ type: "awareness", update: Array.from(awarenessUpdate) }));
        } else if (msg.type === "chat" && typeof msg.text === "string") {
          this.options.onChatMessage?.({
            userId: msg.userId || "peer",
            name: msg.name || "Peer",
            text: msg.text,
            sentAt: Number(msg.sentAt) || Date.now(),
          });
        }
      } catch (e) {
        console.error("Collaboration message parse error", e);
      }
    };

    this.ws.onerror = () => {
      this.options.onStatusChange?.("error");
    };

    this.ws.onclose = () => {
      this.stopHeartbeat();
      if (!this.destroyed) {
        this.options.onStatusChange?.("disconnected");
        this.scheduleReconnect();
      }
    };
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 25000);
  }

  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.destroyed || this.reconnectTimer) return;
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      if (!this.destroyed) {
        this.connect();
      }
    }, 3000);
  }

  public bindToEditor(editor: monaco.editor.IStandaloneCodeEditor, monacoInstance: typeof monaco) {
    if (this.binding) {
      this.binding.destroy();
    }
    const model = editor.getModel();
    if (model) {
      this.binding = new MonacoBinding(
        this.ytext,
        model,
        new Set([editor]),
        this.awareness,
        monacoInstance
      );
    }
  }

  public getCode(): string {
    return this.ytext.toString();
  }

  public sendChat(text: string): boolean {
    const cleanText = text.trim().slice(0, 500);
    if (!cleanText || !this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify({ type: "chat", text: cleanText }));
    return true;
  }

  public destroy() {
    this.destroyed = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.binding) {
      this.binding.destroy();
      this.binding = null;
    }
    this.awareness.destroy();
    this.doc.destroy();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.options.onStatusChange?.("idle");
  }
}
