"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowRight, BookOpen, Award, CheckCircle2, Sparkles } from "lucide-react";
import { sound } from "@/lib/sound";
import type { MissionAttemptResult } from "@/types/game";

interface VictoryModalProps {
  result: MissionAttemptResult;
  onClose: () => void;
  onNextMission?: () => void;
}

export function VictoryModal({ result, onClose, onNextMission }: VictoryModalProps) {
  useEffect(() => {
    if (result.leveledUp) {
      sound.playLevelUp();
    } else {
      sound.playSuccess();
    }

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  }, [result]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl sm:p-8">
        <div className="relative space-y-6 text-center">
          {/* Header Icon */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-950/30 text-emerald-400">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-300">
              <Sparkles className="h-3 w-3" />
              <span>Concept Mastered</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white">Lesson Completed!</h2>
            <p className="mt-1 text-xs text-zinc-400">
              All ground-truth test vectors validated with expected time &amp; space complexity.
            </p>
          </div>

          {/* Level Promotion */}
          {result.leveledUp && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-amber-300">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Level Promoted</p>
              <p className="text-base font-bold mt-0.5">Advanced to Level {result.currentLevel}!</p>
            </div>
          )}

          {/* Telemetry Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">XP Earned</span>
              <p className="mt-0.5 font-bold text-base text-indigo-400">+{result.xpEarned}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Total XP</span>
              <p className="mt-0.5 font-bold text-base text-zinc-200">{result.totalXp}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
              <span className="text-[10px] font-bold text-zinc-500 uppercase">Runtime</span>
              <p className="mt-0.5 font-bold text-base text-emerald-400">{result.executionTime}ms</p>
            </div>
          </div>

          {/* Key Pedagogical Takeaway */}
          {result.conceptExplanation && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5 text-left">
              <div className="flex items-center gap-1.5 text-indigo-300">
                <BookOpen className="h-3.5 w-3.5" />
                <span className="text-xs font-bold">Key Pedagogical Takeaway</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-zinc-300">
                {result.conceptExplanation}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2.5 pt-2 sm:flex-row">
            {result.nextMissionId ? (
              <Link
                href={`/missions/${result.nextMissionId}`}
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                <span>Next Lesson</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ) : (
              <Link
                href="/world"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-500"
              >
                <span>Curriculum Tracks</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="btn-secondary text-xs"
            >
              Review Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
