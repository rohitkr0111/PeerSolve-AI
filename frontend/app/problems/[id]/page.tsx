"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Users, Copy, Check, LogOut, MessageCircle, Sparkles } from "lucide-react";
import { MentorChatPanel } from "@/components/mentor-chat-panel";
import api, { apiError } from "@/lib/api";
import { auth } from "@/lib/auth";
import { Badge, format } from "@/components/problem-ui";
import { Loading } from "@/components/loading";
import type { ExecutionResult, ProblemDetail, Submission } from "@/types/problems";
import type { CollaborationSession, CollaboratorPresence, ConnectionStatus, CollaborationChatMessage } from "@/types/collaboration";
import { CollaborationClient } from "@/lib/collaboration";
import type * as monaco from "monaco-editor";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Loading compact className="h-[380px] bg-slate-950 text-slate-400" message="Loading editor…" />,
});

export default function ProblemPage() {
  return (
    <Suspense fallback={<Loading className="min-h-screen text-slate-400" message="Loading problem…" />}>
      <ProblemContent />
    </Suspense>
  );
}

function ProblemContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [code, setCode] = useState("");
  const [history, setHistory] = useState<Submission[]>([]);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"run" | "submit" | null>(null);

  // AI Mentor chat panel
  const [showMentorChat, setShowMentorChat] = useState(false);

  // Collaboration state
  const [mode, setMode] = useState<"personal" | "peer">("personal");
  const [activeSession, setActiveSession] = useState<CollaborationSession | null>(null);
  const [collabStatus, setCollabStatus] = useState<ConnectionStatus>("idle");
  const [collaborators, setCollaborators] = useState<CollaboratorPresence[]>([]);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [collabError, setCollabError] = useState("");
  const [creatingSession, setCreatingSession] = useState(false);
  const [joiningSession, setJoiningSession] = useState(false);
  const [copied, setCopied] = useState(false);
  const [chatMessages, setChatMessages] = useState<CollaborationChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof monaco | null>(null);
  const collabClientRef = useRef<CollaborationClient | null>(null);

  // Load problem details and submission history
  useEffect(() => {
    api.get<ProblemDetail>(`/api/problems/${id}`)
      .then((r) => {
        setProblem(r.data);
        setCode(r.data.starterCode);
      })
      .catch((e) => setError(apiError(e)));

    api.get<Submission[]>(`/api/submissions/my?problemId=${id}`)
      .then((r) => setHistory(r.data))
      .catch(() => {});
  }, [id]);

  // Handle URL session query param for joining directly
  useEffect(() => {
    const sessionParam = searchParams.get("session");
    if (sessionParam && problem) {
      setMode("peer");
      api.get<CollaborationSession>(`/api/collaboration/sessions/${sessionParam}`)
        .then((r) => {
          setActiveSession(r.data);
          api.post(`/api/collaboration/sessions/${sessionParam}/join`).catch(() => {});
          startCollaboration(r.data, r.data.currentCode || problem.starterCode);
        })
        .catch((e) => {
          setCollabError(apiError(e));
        });
    }
  }, [searchParams, problem]);

  const startCollaboration = (session: CollaborationSession, initialCodeText: string) => {
    if (collabClientRef.current) {
      collabClientRef.current.destroy();
      collabClientRef.current = null;
    }

    const currentUser = auth.user();
    const userId = currentUser ? currentUser.id : "guest-" + Math.random().toString(36).substring(2, 7);
    const userName = currentUser ? currentUser.name : "Peer";

    const client = new CollaborationClient({
      sessionId: session.id,
      userId,
      userName,
      initialCode: initialCodeText,
      onStatusChange: setCollabStatus,
      onPresenceChange: setCollaborators,
      onCodeChange: (updatedCode) => {
        // Shared code updated
      },
      onChatMessage: (message) => setChatMessages((messages) => [...messages.slice(-49), message]),
    });

    collabClientRef.current = client;

    if (editorRef.current && monacoRef.current) {
      client.bindToEditor(editorRef.current, monacoRef.current);
    }
  };

  const stopCollaboration = () => {
    if (collabClientRef.current) {
      collabClientRef.current.destroy();
      collabClientRef.current = null;
    }
    setCollaborators([]);
    setChatMessages([]);
    setChatInput("");
    setCollabStatus("idle");
    if (editorRef.current) {
      editorRef.current.setValue(code);
    }
  };

  const handleSwitchMode = (newMode: "personal" | "peer") => {
    if (newMode === mode) return;
    setMode(newMode);
    if (newMode === "personal") {
      stopCollaboration();
    } else if (newMode === "peer" && activeSession) {
      startCollaboration(activeSession, activeSession.currentCode || code);
    }
  };

  const createSession = async () => {
    const currentUser = auth.user();
    if (!currentUser) {
      setCollabError("Please log in to create a collaborative session.");
      return;
    }
    setCollabError("");
    setCreatingSession(true);
    try {
      const { data } = await api.post<CollaborationSession>("/api/collaboration/sessions", {
        problemId: id,
        initialCode: code,
      });
      setActiveSession(data);
      startCollaboration(data, code);
      router.replace(`/problems/${id}?session=${data.id}`);
    } catch (e) {
      setCollabError(apiError(e));
    } finally {
      setCreatingSession(false);
    }
  };

  const joinSession = async (sessionIdToJoin: string) => {
    const cleanId = sessionIdToJoin.trim();
    if (!cleanId) return;
    const currentUser = auth.user();
    if (!currentUser) {
      setCollabError("Please log in to join a collaborative session.");
      return;
    }
    setCollabError("");
    setJoiningSession(true);
    try {
      const { data } = await api.get<CollaborationSession>(`/api/collaboration/sessions/${cleanId}`);
      if (data.problemId !== id) {
        setCollabError("This session is for a different problem.");
        setJoiningSession(false);
        return;
      }
      await api.post(`/api/collaboration/sessions/${cleanId}/join`).catch(() => {});
      setActiveSession(data);
      startCollaboration(data, data.currentCode || code);
      router.replace(`/problems/${id}?session=${data.id}`);
    } catch (e) {
      setCollabError(apiError(e));
    } finally {
      setJoiningSession(false);
    }
  };

  const leaveSession = async () => {
    if (activeSession) {
      api.post(`/api/collaboration/sessions/${activeSession.id}/leave`).catch(() => {});
    }
    stopCollaboration();
    setActiveSession(null);
    setMode("personal");
    router.replace(`/problems/${id}`);
  };

  const copySessionLink = () => {
    if (!activeSession) return;
    const link = `${window.location.origin}/problems/${id}?session=${activeSession.id}`;
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const sendChatMessage = () => {
    const message = chatInput.trim().slice(0, 500);
    const client = collabClientRef.current;
    if (!message || !client) return;
    if (client.sendChat(message)) {
      const currentUser = auth.user();
      setChatMessages((messages) => [
        ...messages.slice(-49),
        {
          userId: currentUser?.id ?? "guest",
          name: currentUser?.name ?? "You",
          text: message,
          sentAt: Date.now(),
        },
      ]);
      setChatInput("");
    }
  };

  const execute = async (kind: "run" | "submit") => {
    const currentCode = mode === "peer" && collabClientRef.current
      ? collabClientRef.current.getCode()
      : code;

    if (!currentCode.trim()) return setError("Write some Java code before running it.");
    setBusy(kind);
    setError("");
    setResult(null);

    try {
      if (kind === "run") {
        const { data } = await api.post<ExecutionResult>("/api/submissions/run", {
          problemId: id,
          language: "java",
          code: currentCode,
        });
        setResult(data);
      } else {
        const { data } = await api.post<Submission>("/api/submissions", {
          problemId: id,
          language: "java",
          code: currentCode,
        });
        setResult({
          status: data.status,
          testCasesPassed: data.testCasesPassed,
          totalTestCases: data.totalTestCases,
          executionTime: data.executionTime,
          memory: data.memory,
          output: "",
          testCases: [],
        });
        setHistory((h) => [data, ...h]);
      }

      // Update backend code snapshot for collaboration session
      if (mode === "peer" && activeSession) {
        api.put(`/api/collaboration/sessions/${activeSession.id}/code`, {
          code: currentCode,
        }).catch(() => {});
      }
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy(null);
    }
  };

  if (error && !problem) return <PageMessage message={error} />;
  if (!problem) return <Loading className="min-h-screen text-slate-400" message="Loading problem…" />;

  return (
    <main className="min-h-screen px-5 py-6 lg:px-8">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/problems" className="text-xl font-bold">
          Peer<span className="text-cyan-400">Solve</span>
        </Link>
        <Link href="/problems" className="btn-secondary">
          ← Problems
        </Link>
      </header>

      <div className="mx-auto mt-8 grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <article className="card max-h-[calc(100vh-9rem)] overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-3xl font-bold">{problem.title}</h1>
            <Badge value={problem.difficulty} />
          </div>
          <p className="mt-4 text-sm text-cyan-300">{problem.topics.map(format).join(" • ")}</p>
          <h2 className="mt-8 text-lg font-bold">Description</h2>
          <p className="mt-3 leading-7 text-slate-300">{problem.description}</p>
          <h2 className="mt-8 text-lg font-bold">Examples</h2>
          {problem.examples.map((e, i) => (
            <div key={i} className="mt-3 rounded-lg bg-slate-950 p-4 font-mono text-sm">
              <p>
                <span className="text-slate-500">Input: </span>
                {e.input}
              </p>
              <p className="mt-2">
                <span className="text-slate-500">Output: </span>
                {e.output}
              </p>
            </div>
          ))}
          <h2 className="mt-8 text-lg font-bold">Constraints</h2>
          <ul className="mt-3 list-inside list-disc text-sm text-slate-300">
            {problem.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3 rounded-xl bg-slate-950 p-4 text-sm sm:grid-cols-2">
            <p>
              <span className="block text-slate-500">Expected time</span>
              {problem.expectedTimeComplexity}
            </p>
            <p>
              <span className="block text-slate-500">Expected space</span>
              {problem.expectedSpaceComplexity}
            </p>
          </div>
          <Link href="/world" className="btn-primary mt-7 inline-flex items-center gap-2">
            🤖 ADA-7 Campaign Guidance →
          </Link>
        </article>

        <section className="space-y-5">
          {/* Mode Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-full border border-slate-800 bg-slate-950 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleSwitchMode("personal")}
                className={`rounded-full px-3.5 py-1.5 transition ${
                  mode === "personal"
                    ? "bg-slate-800 text-slate-100 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Personal
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode("peer")}
                className={`rounded-full px-3.5 py-1.5 transition ${
                  mode === "peer"
                    ? "bg-cyan-400 font-bold text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Peer-to-Peer
              </button>
            </div>

            {mode === "peer" && activeSession && (
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono text-slate-500">
                  Room: <strong className="text-slate-300">{activeSession.id}</strong>
                </span>
                <button
                  type="button"
                  onClick={copySessionLink}
                  className="flex items-center gap-1 rounded-full border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                  title="Copy shareable session link"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? "Copied!" : "Copy Link"}</span>
                </button>
                <button
                  type="button"
                  onClick={leaveSession}
                  className="flex items-center gap-1 rounded-full border border-rose-500/30 px-2.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/10"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Leave</span>
                </button>
              </div>
            )}
          </div>

          {/* Peer mode session setup card when no session active */}
          {mode === "peer" && !activeSession && (
            <div className="card border-dashed p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-bold">
                    <Users className="h-4 w-4 text-cyan-400" />
                    Peer-to-Peer Collaboration
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Solve together in real time with synchronized code, cursors, and presence.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={createSession}
                    disabled={creatingSession}
                    className="btn-primary px-4 py-2 text-xs whitespace-nowrap"
                  >
                    {creatingSession ? "Creating…" : "Create Session"}
                  </button>
                  <span className="text-xs text-slate-500">or</span>
                  <div className="flex items-center gap-1">
                    <input
                      value={joinCodeInput}
                      onChange={(e) => setJoinCodeInput(e.target.value)}
                      placeholder="Room code"
                      className="w-28 px-2.5 py-1.5 font-mono text-xs"
                      onKeyDown={(e) => e.key === "Enter" && joinSession(joinCodeInput)}
                    />
                    <button
                      type="button"
                      onClick={() => joinSession(joinCodeInput)}
                      disabled={!joinCodeInput.trim() || joiningSession}
                      className="btn-secondary px-3 py-1.5 text-xs"
                    >
                      {joiningSession ? "…" : "Join"}
                    </button>
                  </div>
                </div>
              </div>
              {collabError && (
                <p className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-200">
                  {collabError}
                </p>
              )}
            </div>
          )}

          {/* Active collaborators presence bar */}
          {mode === "peer" && activeSession && (
            <div className="flex flex-wrap items-center gap-2 px-1 text-xs">
              <span className="text-slate-500">Collaborators:</span>
              {collaborators.map((c) => (
                <span
                  key={c.clientId}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-950 px-2.5 py-0.5 text-xs font-medium text-slate-300"
                >
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                  <span>
                    {c.name}
                    {c.isLocal ? " (You)" : ""}
                  </span>
                </span>
              ))}
              {collaborators.length <= 1 && (
                <span className="text-xs italic text-slate-500">
                  Waiting for peers… share the session link to code together!
                </span>
              )}
            </div>
          )}

          {mode === "peer" && activeSession && (
            <div className="card p-4">
              <div className="flex items-center gap-2 text-sm font-bold">
                <MessageCircle className="h-4 w-4 text-cyan-400" />
                Room Chat
              </div>
              <div className="mt-3 max-h-40 space-y-2 overflow-y-auto rounded-lg bg-slate-950 p-3">
                {chatMessages.length === 0 ? (
                  <p className="text-xs text-slate-500">Start a conversation with your peers.</p>
                ) : (
                  chatMessages.map((message, index) => (
                    <p key={`${message.sentAt}-${index}`} className="text-xs text-slate-300">
                      <span className="font-semibold text-cyan-300">{message.name}</span>
                      <span className="mx-2 text-slate-600">•</span>
                      {message.text}
                    </p>
                  ))
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={chatInput}
                  maxLength={500}
                  onChange={(event) => setChatInput(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && sendChatMessage()}
                  placeholder="Message your peers..."
                  className="min-w-0 flex-1 px-3 py-2 text-xs"
                />
                <button type="button" onClick={sendChatMessage} disabled={!chatInput.trim()} className="btn-primary px-3 py-2 text-xs disabled:opacity-50">
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Code Editor */}
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span>Java</span>
                <span className="text-slate-500">Main.java</span>
              </div>
              <div>
                {mode === "peer" && activeSession ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Live Collaboration
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Personal Workspace</span>
                )}
              </div>
            </div>
            <Editor
              height="430px"
              theme="vs-dark"
              defaultLanguage="java"
              value={code}
              onChange={(v) => {
                if (mode === "personal") {
                  setCode(v ?? "");
                }
              }}
              onMount={(editor, monacoInstance) => {
                editorRef.current = editor;
                monacoRef.current = monacoInstance;
                if (mode === "peer" && collabClientRef.current) {
                  collabClientRef.current.bindToEditor(editor, monacoInstance);
                }
              }}
              options={{ fontSize: 14, minimap: { enabled: false }, padding: { top: 16 } }}
            />
          </div>

          <div className="flex gap-3">
            <button
              disabled={!!busy}
              onClick={() => execute("run")}
              className="btn-secondary disabled:opacity-50"
            >
              {busy === "run" ? "Running…" : "Run"}
            </button>
            <button
              disabled={!!busy}
              onClick={() => execute("submit")}
              className="btn-primary disabled:opacity-50"
            >
              {busy === "submit" ? "Submitting…" : "Submit"}
            </button>
            <button
              onClick={() => setShowMentorChat((v) => !v)}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                showMentorChat
                  ? "border-purple-500/60 bg-purple-500/20 text-purple-200"
                  : "border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              AI Mentor
            </button>
          </div>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
              {error}
            </p>
          )}
          {result && <Results result={result} />}

          {/* AI Mentor Chat Panel */}
          {showMentorChat && (
            <div className="h-[480px]">
              <MentorChatPanel
                problemId={id}
                code={
                  mode === "peer" && collabClientRef.current
                    ? collabClientRef.current.getCode()
                    : code
                }
                executionStatus={result?.status}
                executionMessage={result?.output}
                failingTest={result?.testCases?.find((t) => !t.passed)?.output}
                onClose={() => setShowMentorChat(false)}
              />
            </div>
          )}

          <History
            submissions={history}
            onSelect={(s) => {
              if (!s.code) return;
              if (mode === "peer" && collabClientRef.current) {
                const client = collabClientRef.current;
                client.doc.transact(() => {
                  client.ytext.delete(0, client.ytext.length);
                  client.ytext.insert(0, s.code!);
                });
              } else {
                setCode(s.code);
                if (editorRef.current) {
                  editorRef.current.setValue(s.code);
                }
              }
            }}
          />
        </section>
      </div>
    </main>
  );
}

function Results({ result }: { result: ExecutionResult }) {
  const accepted = result.status === "ACCEPTED";
  return (
    <div className="card p-5">
      <h2 className={`text-xl font-bold ${accepted ? "text-emerald-300" : "text-rose-300"}`}>
        {accepted ? "🎉 Accepted" : `❌ ${format(result.status)}`}
      </h2>
      <p className="mt-2 text-sm text-slate-300">
        {result.testCasesPassed} / {result.totalTestCases} test cases passed · Runtime: {result.executionTime}ms
      </p>
      {result.testCases.length > 0 && (
        <div className="mt-4 space-y-2">
          {result.testCases.map((t) => (
            <p key={t.number} className={t.passed ? "text-emerald-300" : "text-rose-300"}>
              {t.passed ? "✓" : "✗"} Test case {t.number} — {t.status}
            </p>
          ))}
        </div>
      )}
      {result.output && (
        <pre className="mt-4 max-h-36 overflow-auto rounded-lg bg-slate-950 p-3 text-xs text-slate-300">
          {result.output}
        </pre>
      )}
    </div>
  );
}

function History({
  submissions,
  onSelect,
}: {
  submissions: Submission[];
  onSelect: (s: Submission) => void;
}) {
  return (
    <div className="card p-5">
      <h2 className="text-lg font-bold">Submission History</h2>
      {submissions.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">No submissions yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {submissions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="flex w-full items-center justify-between rounded-lg bg-slate-950 p-3 text-left text-sm hover:bg-slate-800"
            >
              <span className={s.status === "ACCEPTED" ? "text-emerald-300" : "text-rose-300"}>
                {s.status === "ACCEPTED" ? "✓" : "✗"} {format(s.status)}
              </span>
              <span className="text-slate-400">
                Java · {s.executionTime ?? 0}ms · {new Date(s.createdAt).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PageMessage({ message }: { message: string }) {
  return <main className="grid min-h-screen place-items-center text-slate-400">{message}</main>;
}
