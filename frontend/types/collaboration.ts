export type CollaborationSession = {
  id: string;
  problemId: string;
  hostUserId: string;
  hostUserName: string;
  currentCode: string;
  activeUserIds: string[];
  participantNames: Record<string, string>;
  status: string;
  createdAt: string;
};

export type CollaboratorPresence = {
  clientId: number;
  userId: string;
  name: string;
  color: string;
  isLocal: boolean;
};

export type ConnectionStatus = "idle" | "connecting" | "connected" | "disconnected" | "error";
