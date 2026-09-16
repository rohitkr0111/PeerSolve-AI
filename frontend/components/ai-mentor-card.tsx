"use client";

import { useState } from "react";
import { Bot, Lightbulb, AlertTriangle, CheckCircle2, ChevronRight, HelpCircle, ShieldAlert } from "lucide-react";
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
      setErrorMsg("Neural link timeout: Unable to fetch tactical hint.");
    } finally {
      setLoadingHint(false);
    }
  };

  const getToneBadge = (tone?: string) => {
    switch (tone) {
      case "TRIUMPHANT":
        return "border-emerald-500/40 bg-emerald-500/10 text-emerald-300";
      case "ALERT":
        return "border-rose-500/40 bg-rose-500/10 text-rose-300";
      case "ANALYTICAL":
        return "border-amber-500/40 bg-amber-500/10 text-amber-300";
      default:
        return "border-cyan-500/40 bg-cyan-500/10 text-cyan-300";
    }
  };

  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-5 shadow-xl shadow-cyan-950/30 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 shadow-inner">
            <Bot className="h-6 w-6 animate-pulse" />
            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-wider text-slate-100">
                ADA-7 // TACTICIAN AI
              </span>
              <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${getToneBadge(feedback?.tone)}`}>
                {feedback ? feedback.diagnosis : "ACTIVE_MONITOR"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Contextual Algorithmic Advisor</p>
          </div>
        </div>

        {/* Hint Trigger Button */}
        {hintTier < totalHintsAvailable && (
          <button
            onClick={requestNextHint}
            disabled={loadingHint}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 font-mono text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/20 disabled:opacity-50"
          >
            <Lightbulb className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
            <span>
              {loadingHint ? "Decryption..." : `Get Hint ${hintTier + 1}/${totalHintsAvailable}`}
            </span>
          </button>
        )}
      </div>

      {/* Main Mentor Dialogue */}
      <div className="mt-4 space-y-3">
        {feedback ? (
          <div className={`rounded-xl border p-4 text-sm leading-relaxed ${
            feedback.tone === "TRIUMPHANT"
              ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-200"
              : feedback.tone === "ALERT"
              ? "border-rose-500/30 bg-rose-950/20 text-rose-200"
              : feedback.tone === "ANALYTICAL"
              ? "border-amber-500/30 bg-amber-950/20 text-amber-200"
              : "border-slate-800 bg-slate-950/60 text-slate-300"
          }`}>
            <div className="flex items-start gap-2.5">
              {feedback.tone === "TRIUMPHANT" ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              ) : feedback.tone === "ALERT" ? (
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              )}
              <div className="space-y-1">
                <p className="font-medium">{feedback.message}</p>
                {feedback.suggestedAction && (
                  <p className="text-xs opacity-85">
                    <span className="font-semibold text-cyan-300">Action: </span>
                    {feedback.suggestedAction}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-950/40 p-3 text-xs text-slate-400">
            <HelpCircle className="h-4 w-4 text-cyan-400" />
            <p>
              Telemetry sensors linked. Submit your code attempt or request a progressive hint if you encounter an algorithmic bottleneck.
            </p>
          </div>
        )}

        {/* Revealed Hints Carousel/List */}
        {activeHints.length > 0 && (
          <div className="space-y-2 pt-1">
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Decrypted Hints ({activeHints.length}/{totalHintsAvailable})
            </p>
            {activeHints.map((hint, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-950/20 p-3 text-xs leading-relaxed text-amber-200/90"
              >
                <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                <span>{hint}</span>
              </div>
            ))}
            <p className="text-[10px] text-slate-500">
              Note: Using hints scales final mission XP by -20% per tier to encourage unassisted mastery.
            </p>
          </div>
        )}

        {errorMsg && (
          <p className="text-xs text-rose-400">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}
