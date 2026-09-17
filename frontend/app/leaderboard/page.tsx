"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Flame,
  Target,
  Zap,
  CheckCircle2,
  Bot
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { gameApi } from "@/lib/game-api";
import type { LeaderboardEntry } from "@/types/game";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameApi
      .getLeaderboard()
      .then((data) => setEntries(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <GameNav />
        <main className="grid min-h-[70vh] place-items-center text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <Bot className="h-4 w-4 animate-spin text-indigo-400" />
            <span>Loading peer rankings...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <GameNav />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 text-xs text-zinc-400">
            <Trophy className="h-3.5 w-3.5 text-indigo-400" />
            <span>Peer Learning Metrics</span>
          </div>
          <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Mastery &amp; Consistency Rankings
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Rankings calibrated from unassisted lesson completions, mastery milestones, and active learning streaks.
          </p>
        </div>

        {/* Clean Rankings Table */}
        <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-zinc-800 bg-zinc-900/80 font-mono text-[11px] text-zinc-400">
                <tr>
                  <th className="px-5 py-3 font-semibold">Rank</th>
                  <th className="px-5 py-3 font-semibold">Student</th>
                  <th className="px-5 py-3 font-semibold text-center">Level</th>
                  <th className="px-5 py-3 font-semibold text-center">Streak</th>
                  <th className="px-5 py-3 font-semibold text-right">Mastery Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                {entries.map((player) => (
                  <tr
                    key={player.userId || player.rank}
                    className={`transition hover:bg-zinc-900/60 ${
                      player.isCurrentPlayer ? "bg-indigo-950/20 font-medium text-white" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 font-mono text-zinc-400">
                      {player.rank === 1 ? (
                        <span className="font-bold text-amber-400">#1</span>
                      ) : player.rank === 2 ? (
                        <span className="font-bold text-zinc-300">#2</span>
                      ) : player.rank === 3 ? (
                        <span className="font-bold text-amber-600">#3</span>
                      ) : (
                        `#${player.rank}`
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-medium text-white">
                      <div className="flex items-center gap-2">
                        <span>{player.username}</span>
                        {player.isCurrentPlayer && (
                          <span className="rounded bg-indigo-600/30 px-1.5 py-0.2 text-[10px] text-indigo-300">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono text-zinc-400">
                      Lvl {player.level}
                    </td>
                    <td className="px-5 py-3.5 text-center font-mono">
                      <span className="inline-flex items-center gap-1 text-amber-400">
                        <Flame className="h-3 w-3 fill-amber-400" />
                        <span>{player.streakDays}d</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-mono font-semibold text-indigo-400">
                      {player.xp} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
