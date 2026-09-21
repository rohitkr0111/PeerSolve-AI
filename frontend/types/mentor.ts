export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface MentorRequestDto {
  problemId?: string;
  missionId?: string;
  code: string;
  question?: string;
  executionStatus?: string;
  executionMessage?: string;
  failingTest?: string;
  hintsUsed?: number;
  conversationHistory?: ChatMessage[];
}

export interface MentorResponseDto {
  diagnosisCode: string;
  message: string;
  evidence: string[];
  suggestedAction: string;
  nextHintTier?: number | null;
  confidence?: number | null;
  fallbackUsed?: boolean;
  modelVersion?: string | null;
}
