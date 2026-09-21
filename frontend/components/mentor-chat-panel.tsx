"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, X, Loader2, Bot, User, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { analyzeMentor } from "@/lib/mentor-api";
import type { ChatMessage } from "@/types/mentor";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  // Build conversation history from all previous messages (for LLM context)
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

    // Capture the history BEFORE adding this user message
    const history = buildHistory();

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const response = await analyzeMentor({
        problemId,
        code,
        question,
        executionStatus: executionStatus ?? "UNKNOWN",
        executionMessage: executionMessage ?? "",
        failingTest: failingTest ?? "",
        hintsUsed: 0,
        conversationHistory: history,
      });

      const assistantMsg: DisplayMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.message,
        timestamp: Date.now(),
        fallbackUsed: response.fallbackUsed,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: DisplayMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "⚠️ Sorry, I couldn't process your request right now. Please try again.",
        timestamp: Date.now(),
        fallbackUsed: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-grow textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const clearChat = () => setMessages([]);

  const quickActions = [
    "What's wrong with my code?",
    "Give me the correct code",
    "Explain how to solve this",
    "Give me a hint",
  ];

  return (
    <div className="flex h-full flex-col rounded-2xl border border-purple-500/20 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-purple-950/20">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/40 bg-purple-950/50 text-purple-300">
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
            <p className="text-[10px] text-slate-500">
              {messages.length > 0
                ? `${messages.length} message${messages.length > 1 ? "s" : ""} in this session`
                : "Ask anything about your code"}
            </p>
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
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-500/30 bg-purple-950/30 text-purple-300">
              <Bot className="h-7 w-7" />
            </div>
            <p className="text-sm font-medium text-slate-300">
              Hi! I&apos;m ADA-7, your AI mentor.
            </p>
            <p className="mt-1 max-w-xs text-xs text-slate-500">
              Ask me to explain your errors, give you the solution code, or help you understand any concept.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {quickActions.map((action) => (
                <button
                  key={action}
                  onClick={() => sendMessage(action)}
                  className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1.5 text-[11px] font-medium text-slate-300 transition hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-purple-200"
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
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-950/40 text-purple-300">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "rounded-br-md bg-purple-600/25 text-purple-100 border border-purple-500/20"
                  : "rounded-bl-md border border-slate-700/60 bg-slate-800/60 text-slate-200"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="mentor-markdown">
                  <ReactMarkdown
                    components={{
                      // Code blocks with syntax highlighting label
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        const isBlock = String(children).includes("\n");
                        if (isBlock || match) {
                          return (
                            <div className="my-2 overflow-hidden rounded-lg border border-slate-700/50">
                              {match && (
                                <div className="border-b border-slate-700/50 bg-slate-900 px-3 py-1">
                                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                                    {match[1]}
                                  </span>
                                </div>
                              )}
                              <pre className="overflow-x-auto bg-slate-950 p-3">
                                <code className="text-xs text-slate-200">{children}</code>
                              </pre>
                            </div>
                          );
                        }
                        return (
                          <code className="rounded bg-slate-700/50 px-1.5 py-0.5 text-xs font-mono text-purple-200" {...props}>
                            {children}
                          </code>
                        );
                      },
                      // Paragraphs
                      p({ children }) {
                        return <p className="mb-2 last:mb-0">{children}</p>;
                      },
                      // Lists
                      ul({ children }) {
                        return <ul className="mb-2 ml-4 list-disc space-y-1 text-sm">{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol className="mb-2 ml-4 list-decimal space-y-1 text-sm">{children}</ol>;
                      },
                      li({ children }) {
                        return <li className="text-slate-300">{children}</li>;
                      },
                      // Headings
                      h1({ children }) {
                        return <h1 className="mb-2 mt-3 text-base font-bold text-slate-100">{children}</h1>;
                      },
                      h2({ children }) {
                        return <h2 className="mb-1.5 mt-2.5 text-sm font-bold text-slate-100">{children}</h2>;
                      },
                      h3({ children }) {
                        return <h3 className="mb-1 mt-2 text-sm font-semibold text-slate-200">{children}</h3>;
                      },
                      // Bold and italic
                      strong({ children }) {
                        return <strong className="font-semibold text-slate-100">{children}</strong>;
                      },
                      em({ children }) {
                        return <em className="text-purple-200">{children}</em>;
                      },
                      // Blockquotes
                      blockquote({ children }) {
                        return (
                          <blockquote className="my-2 border-l-2 border-purple-500/40 pl-3 text-slate-400 italic">
                            {children}
                          </blockquote>
                        );
                      },
                      // Horizontal rules
                      hr() {
                        return <hr className="my-3 border-slate-700/50" />;
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <span>{msg.content}</span>
              )}
              {msg.role === "assistant" && msg.fallbackUsed && (
                <span className="mt-2 block text-[10px] text-amber-400/60">
                  ⚠ Rule-based response (AI unavailable)
                </span>
              )}
            </div>
            {msg.role === "user" && (
              <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-950/30 text-cyan-300">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5">
            <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-purple-500/30 bg-purple-950/40 text-purple-300">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-700/60 bg-slate-800/60 px-4 py-3 text-sm text-slate-400">
              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              <span>Thinking…</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-800/80 p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your code… (Enter to send, Shift+Enter for new line)"
            disabled={loading}
            rows={1}
            className="min-w-0 flex-1 resize-none rounded-xl border border-slate-700 bg-slate-800/50 px-3.5 py-2.5 text-sm text-slate-200 placeholder-slate-500 outline-none transition focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 disabled:opacity-50"
            style={{ maxHeight: 120 }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-600 text-white transition hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
