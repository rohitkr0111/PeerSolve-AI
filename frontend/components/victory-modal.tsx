"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Trophy, Zap, ArrowRight, BookOpen, Award, CheckCircle } from "lucide-react";
import { sound } from "@/lib/sound";
import type { MissionAttemptResult } from "@/types/game";

interface VictoryModalProps {
  result: MissionAttemptResult;
  onClose: () => void;
}

export function VictoryModal({ result, onClose }: VictoryModalProps) {
  useEffect(() => {
    if (result.leveledUp) {
      sound.playLevelUp();
    } else {
      sound.playSuccess();
    }

    // Launch confetti bursts
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 250);
    } catch {}
  }, [result]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 shadow-2xl shadow-emerald-950/50 sm:p-8">
        {/* Glow accent */}
        <div className="absolute -right-16 -top-16 h-36 w-36 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-36 w-36 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative space-y-6 text-center">
          {/* Trophy Header */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-emerald-500/50 bg-emerald-950/40 shadow-lg shadow-emerald-500/20">
            <Trophy className="h-10 w-10 text-emerald-400" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-300">
              <CheckCircle className="h-3.5 w-3.5" />
              <span>MISSION ACCOMPLISHED</span>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold text-slate-100">Tactical Victory!</h2>
            <p className="mt-1 text-sm text-slate-400">
              All ground-truth test vectors validated with expected time complexity.
            </p>
          </div>

          {/* Level Up Banner */}
          {result.leveledUp && (
            <div className="animate-bounce rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 p-3 text-amber-300">
              <p className="font-mono text-xs font-bold uppercase tracking-widest">RANK PROMOTION</p>
              <p className="text-lg font-black">PROMOTED TO LEVEL {result.currentLevel}!</p>
            </div>
          )}

          {/* XP & Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="font-mono text-xs text-slate-400">XP EARNED</span>
              <p className="mt-1 font-mono text-xl font-bold text-cyan-400">+{result.xpEarned}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="font-mono text-xs text-slate-400">TOTAL XP</span>
              <p className="mt-1 font-mono text-xl font-bold text-slate-200">{result.totalXp}</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <span className="font-mono text-xs text-slate-400">RUNTIME</span>
              <p className="mt-1 font-mono text-xl font-bold text-emerald-400">{result.executionTime}ms</p>
            </div>
          </div>

          {/* New Achievements */}
          {result.newlyUnlockedAchievements && result.newlyUnlockedAchievements.length > 0 && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-left">
              <div className="flex items-center gap-2 text-amber-300">
                <Award className="h-4 w-4" />
                <span className="font-mono text-xs font-bold uppercase">Badge Unlocked</span>
              </div>
              <p className="mt-1 font-mono text-sm text-slate-200">
                {result.newlyUnlockedAchievements.join(", ")}
              </p>
            </div>
          )}

          {/* Concept Explanation */}
          {result.conceptExplanation && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-left">
              <div className="flex items-center gap-2 text-cyan-400">
                <BookOpen className="h-4 w-4" />
                <span className="font-mono text-xs font-bold uppercase">Core Concept Mastered</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-300">
                {result.conceptExplanation}
              </p>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            {result.nextMissionId ? (
              <Link
                href={`/missions/${result.nextMissionId}`}
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-90"
              >
                <span>Next Mission</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                href="/world"
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-90"
              >
                <span>Return to Sector Map</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="rounded-xl border border-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
            >
              Review Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
