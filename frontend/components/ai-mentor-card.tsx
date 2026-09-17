"use client";

import { useState } from "react";
import {
  Bot,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  ShieldAlert,
  BrainCircuit,
  Zap,
  Check,
  X
} from "lucide-react";
import { sound } from "@/lib/sound";
import { gameApi } from "@/lib/game-api";
import type { MentorFeedback } from "@/types/game";

interface AiMentorCardProps {
  feedback: MentorFeedback | null;
  missionId: string;
  totalHintsAvailable: number;
  onHintRevealed: (hint: string, tier: number) => void;
  hintsUsed: number;
}

export function AiMentorCard({
  feedback,
  missionId,
  totalHintsAvailable,
  onHintRevealed,
  hintsUsed
}: AiMentorCardProps) {
  const [loadingHint, setLoadingHint] = useState(false);
  const [hintTier, setHintTier] = useState(hintsUsed);
  const [activeHints, setActiveHints] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Micro-Challenge state
  const [microChallengeAnswer, setMicroChallengeAnswer] = useState<number | null>(null);
  const [microChallengeSubmitted, setMicroChallengeSubmitted] = useState(false);

  const requestNextHint = async () => {
    if (hintTier >= totalHintsAvailable) return;
    sound.playClick();
    setLoadingHint(true);
    setErrorMsg("");
    try {
      const nextTier = hintTier + 1;
      const res = await gameApi.getHint(missionId, nextTier);
      sound.playHint();
      setHintTier(nextTier);
      setActiveHints((prev) => [...prev, res.hint]);
      onHintRevealed(res.hint, nextTier);
    } catch {
      setErrorMsg("Unable to retrieve tactical hint. Please try again.");
    } finally {
      setLoadingHint(false);
    }
  };

  const getToneBadge = (tone?: string) => {
    switch (tone) {
      case "TRIUMPHANT":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
      case "ALERT":
        return "border-rose-500/30 bg-rose-500/10 text-rose-300";
      case "ANALYTICAL":
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
      default:
        return "border-indigo-500/30 bg-indigo-500/10 text-indigo-300";
    }
  };

  const hasMisconception = feedback?.diagnosis && feedback.diagnosis !== "OPTIMAL_SOLUTION" && feedback.diagnosis !== "NONE_DETECTED";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 shadow-sm backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
            <Bot className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-100">
                AI Diagnosis &amp; Coach
              </span>
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${getToneBadge(feedback?.tone)}`}>
                {feedback ? feedback.diagnosis.replace(/_/g, " ") : "Observing"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Algorithmic Reasoning Engine</p>
          </div>
        </div>

        {/* Socratic Hint Button */}
        {hintTier < totalHintsAvailable && (
          <button
            onClick={requestNextHint}
            disabled={loadingHint}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-800 disabled:opacity-50"
          >
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span>
              {loadingHint ? "Analyzing..." : `Hint (${hintTier + 1}/${totalHintsAvailable})`}
            </span>
          </button>
        )}
      </div>

      {/* Main Diagnosis Content */}
      <div className="mt-4 space-y-3.5">
        {feedback ? (
          <div className="space-y-3">
            {/* Structured Diagnosis Summary */}
            <div className={`rounded-xl border p-4 text-xs leading-relaxed ${
              feedback.tone === "TRIUMPHANT"
                ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-200"
                : feedback.tone === "ALERT"
                ? "border-rose-500/30 bg-rose-950/20 text-rose-200"
                : feedback.tone === "ANALYTICAL"
                ? "border-amber-500/30 bg-amber-950/20 text-amber-200"
                : "border-zinc-800 bg-zinc-950/60 text-zinc-300"
            }`}>
              <div className="flex items-start gap-2.5">
                {feedback.tone === "TRIUMPHANT" ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                ) : feedback.tone === "ALERT" ? (
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                ) : (
                  <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                )}
                <div className="space-y-2 w-full">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                      {feedback.tone === "TRIUMPHANT" ? "Verification Status" : "AI Diagnosis"}
                    </span>
                    <p className="mt-0.5 font-semibold text-white text-xs">{feedback.message}</p>
                  </div>

                  {/* Why This Matters / Key Takeaway */}
                  {feedback.suggestedAction && (
                    <div className="mt-2 rounded-lg bg-zinc-950/60 p-2.5 border border-zinc-800/80">
                      <span className="font-semibold text-indigo-400 text-[11px] block">Recommended Conceptual Adjustment:</span>
                      <span className="text-zinc-300 text-[11px] mt-0.5 block">{feedback.suggestedAction}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Targeted Micro-Challenge (when misconception is detected) */}
            {hasMisconception && (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3.5 text-xs">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold mb-2">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Try This Micro-Challenge</span>
                </div>
                <p className="text-zinc-200 mb-2.5">
                  Before rewriting your code, consider this: which data structure provides $O(1)$ average time to check if an element or its complement was previously seen?
                </p>
                <div className="space-y-1.5">
                  {[
                    { text: "Linear Array scan ($O(N)$ lookup)", correct: false },
                    { text: "HashSet / HashMap ($O(1)$ average lookup)", correct: true },
                    { text: "Stack / Queue ($O(N)$ arbitrary lookup)", correct: false }
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={microChallengeSubmitted}
                      onClick={() => {
                        sound.playClick();
                        setMicroChallengeAnswer(idx);
                        setMicroChallengeSubmitted(true);
                        if (opt.correct) {
                          sound.playSuccess();
                        } else {
                          sound.playError();
                        }
                      }}
                      className={`flex w-full items-center justify-between rounded-lg border p-2 text-left text-xs transition ${
                        microChallengeSubmitted
                          ? opt.correct
                            ? "border-emerald-500/40 bg-emerald-950/30 text-emerald-200"
                            : microChallengeAnswer === idx
                            ? "border-rose-500/40 bg-rose-950/30 text-rose-300"
                            : "border-zinc-800 opacity-40"
                          : microChallengeAnswer === idx
                          ? "border-indigo-500 bg-indigo-950/30 text-white"
                          : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700"
                      }`}
                    >
                      <span>{opt.text}</span>
                      {microChallengeSubmitted && opt.correct && <Check className="h-3.5 w-3.5 text-emerald-400" />}
                      {microChallengeSubmitted && microChallengeAnswer === idx && !opt.correct && <X className="h-3.5 w-3.5 text-rose-400" />}
                    </button>
                  ))}
                </div>
                {microChallengeSubmitted && (
                  <p className="mt-2 text-[11px] text-zinc-400">
                    {microChallengeAnswer === 1
                      ? "✓ Correct! Using a hash-based structure eliminates nested linear scans and drops overall complexity to O(N)."
                      : "Tip: Hash tables store key-value pairs in memory for instant O(1) membership queries."}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-3.5 text-xs text-zinc-400">
            <HelpCircle className="h-4 w-4 text-indigo-400 shrink-0" />
            <p>
              Your AI coach is watching for learning patterns. Run or submit code to receive targeted algorithmic diagnosis.
            </p>
          </div>
        )}

        {/* Revealed Socratic Hints */}
        {activeHints.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Socratic Guidance ({activeHints.length}/{totalHintsAvailable})
            </p>
            {activeHints.map((hint, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-950/60 p-3 text-xs leading-relaxed text-zinc-200"
              >
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span>{hint}</span>
              </div>
            ))}
          </div>
        )}

        {errorMsg && (
          <p className="text-xs text-rose-400">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
