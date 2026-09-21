"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, Loader2, Bot, User, Trash2 } from "lucide-react";
import { analyzeMentor } from "@/lib/mentor-api";
import type { ChatMessage, MentorResponseDto } from "@/types/mentor";

interface MentorChatPanelProps {
  problemId: string;
  code: string;
  executionStatus?: string;
  executionMessage?: string;
  failingTest?: string;
  onClose: () => void;
}

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  fallbackUsed?: boolean;
  modelVersion?: string | null;
}

export function MentorChatPanel({
  problemId,
  code,
  executionStatus,
  executionMessage,
  failingTest,
  onClose,
}: MentorChatPanelProps) {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const buildHistory = (): ChatMessage[] =>
    messages.map((m) => ({ role: m.role, content: m.content }));

  const sendMessage = async (text?: string) => {
    const question = (text ?? input).trim();
    if (!question || loading) return;

    const userMsg: DisplayMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await analyzeMentor({
        problemId,
        code,
        question,
        executionStatus: executionStatus ?? "UNKNOWN",
        executionMessage: executionMessage ?? "",
        failingTest: failingTest ?? "",
        hintsUsed: 0,
        conversationHistory: buildHistory(),
      });

      const assistantMsg: DisplayMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message,
        timestamp: Date.now(),
        fallbackUsed: response.fallbackUsed,
        modelVersion: response.modelVersion,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: DisplayMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: Date.now(),
        fallbackUsed: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const quickActions = [
    "What's wrong with my code?",
    "Explain the error",
    "Give me a hint",
    "How can I optimize this?",
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-purple-500/20 bg-gradient-to-b from-slate-900/95 to-slate-950/95 shadow-2xl shadow-purple-950/20 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-950/40 text-purple-300">
            <Sparkles className="h-4 w-4" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wide text-slate-100">
              ADA-7 AI Mentor
            </h3>
            <p className="text-[10px] text-slate-500">Ask anything about your code</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
              title="Clear chat"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-950/30 text-purple-300">
              <Bot className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-slate-300">
              Hi! I'm ADA-7, your AI mentor.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Ask me anything about your code, errors, or concepts.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  className="rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-200"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-950/30 text-purple-300">
                <Bot className="h-3.5 w-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-md bg-purple-600/30 text-purple-100"
                  : "rounded-bl-md border border-slate-800 bg-slate-800/50 text-slate-200"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="mentor-response whitespace-pre-wrap">{msg.content}</div>
              ) : (
                <span>{msg.content}</span>
              )}
              {msg.role === "assistant" && msg.fallbackUsed && (
                <span className="mt-1.5 block text-[10px] text-amber-400/70">
                  ⚠ Rule-based response (AI unavailable)
                </span>
              )}
            </div>
            {msg.role === "user" && (
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-300">
                <User className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-950/30 text-purple-300">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-800 bg-slate-800/50 px-3.5 py-2.5 text-sm text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-purple-400" />
              <span>Thinking…</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 p-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about your code..."
            disabled={loading}
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-800/50 px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
