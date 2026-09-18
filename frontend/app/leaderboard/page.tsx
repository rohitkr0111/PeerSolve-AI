"use client";

import { useEffect, useState } from "react";
import {
  Trophy,
  Medal,
  Flame,
  Skull,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { Loading } from "@/components/loading";
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

  const topThree = entries.slice(0, 3);
  const remaining = entries.slice(3);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <GameNav />
        <main>
          <Loading message="AGGREGATING GLOBAL SECTOR LEADERBOARD..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <GameNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold text-amber-300">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>GLOBAL TELEMETRY RANKINGS</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-5xl">
            Player Leaderboard
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Real persisted player rankings calculated from mission completions, boss victories, and streaks.
          </p>
        </div>

        {/* Top 3 Podium Cards */}
        {topThree.length > 0 && (
          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            {/* Rank 2 (Silver) */}
            {topThree[1] && (
              <div className="order-2 flex flex-col justify-between rounded-3xl border border-slate-700 bg-slate-900/60 p-6 text-center shadow-xl sm:order-1 sm:translate-y-4">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-500/40 bg-slate-800 text-slate-300">
                    <Medal className="h-8 w-8" />
                  </div>
                  <span className="mt-3 inline-block font-mono text-xs font-bold text-slate-400">
                    RANK #2
                  </span>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-100">
                    {topThree[1].username}
                  </h3>
                  <p className="font-mono text-xs text-cyan-400">
                    Level {topThree[1].level} • {topThree[1].xp} XP
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-4 border-t border-slate-800 pt-4 font-mono text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{topThree[1].missionsCompleted} solved</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{topThree[1].streakDays}d streak</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold) */}
            {topThree[0] && (
              <div className="order-1 flex flex-col justify-between rounded-3xl border border-amber-500/50 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/20 p-8 text-center shadow-2xl shadow-amber-500/10 sm:order-2">
                <div>
                  <div className="mx-auto flex h-18 w-18 items-center justify-center rounded-2xl border border-amber-400/60 bg-amber-500/20 text-amber-300 shadow-lg shadow-amber-500/20">
                    <Trophy className="h-10 w-10" />
                  </div>
                  <span className="mt-4 inline-block rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-0.5 font-mono text-xs font-bold text-amber-300">
                    RANK #1 CHAMPION
                  </span>
                  <h3 className="mt-2 text-2xl font-black text-slate-100">
                    {topThree[0].username}
                  </h3>
                  <p className="font-mono text-sm font-bold text-cyan-400">
                    Level {topThree[0].level} • {topThree[0].xp} XP
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-4 border-t border-slate-800 pt-4 font-mono text-xs text-slate-300">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{topThree[0].missionsCompleted} solved</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-400">
                    <Skull className="h-3.5 w-3.5" />
                    <span>{topThree[0].bossesDefeated} bosses</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{topThree[0].streakDays}d streak</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {topThree[2] && (
              <div className="order-3 flex flex-col justify-between rounded-3xl border border-amber-800/40 bg-slate-900/60 p-6 text-center shadow-xl sm:translate-y-6">
                <div>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-700/40 bg-amber-950/40 text-amber-500">
                    <Medal className="h-8 w-8" />
                  </div>
                  <span className="mt-3 inline-block font-mono text-xs font-bold text-slate-400">
                    RANK #3
                  </span>
                  <h3 className="mt-1 text-xl font-extrabold text-slate-100">
                    {topThree[2].username}
                  </h3>
                  <p className="font-mono text-xs text-cyan-400">
                    Level {topThree[2].level} • {topThree[2].xp} XP
                  </p>
                </div>
                <div className="mt-6 flex justify-center gap-4 border-t border-slate-800 pt-4 font-mono text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{topThree[2].missionsCompleted} solved</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Flame className="h-3.5 w-3.5" />
                    <span>{topThree[2].streakDays}d streak</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl backdrop-blur-md">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-slate-800 bg-slate-950/60 uppercase tracking-wider text-slate-400">
              <tr>
                <th className="px-6 py-3.5">Rank</th>
                <th className="px-6 py-3.5">Player</th>
                <th className="px-6 py-3.5">Level</th>
                <th className="px-6 py-3.5">XP</th>
                <th className="px-6 py-3.5">Missions</th>
                <th className="px-6 py-3.5">Bosses</th>
                <th className="px-6 py-3.5">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {entries.map((entry) => (
                <tr
                  key={entry.userId}
                  className={`transition hover:bg-slate-800/40 ${
                    entry.isCurrentPlayer
                      ? "border-l-4 border-l-cyan-400 bg-cyan-950/20 font-bold text-cyan-200"
                      : "text-slate-300"
                  }`}
                >
                  <td className="px-6 py-4 font-bold">
                    {entry.rank === 1 ? (
                      <span className="text-amber-400">#1 👑</span>
                    ) : entry.rank === 2 ? (
                      <span className="text-slate-300">#2 🥈</span>
                    ) : entry.rank === 3 ? (
                      <span className="text-amber-600">#3 🥉</span>
                    ) : (
                      `#${entry.rank}`
                    )}
                  </td>
                  <td className="px-6 py-4 font-sans text-sm font-bold text-slate-100">
                    {entry.username}
                    {entry.isCurrentPlayer && (
                      <span className="ml-2 rounded border border-cyan-500/40 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] text-cyan-400">
                        YOU
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-cyan-400">LVL {entry.level}</td>
                  <td className="px-6 py-4 font-bold text-slate-100">{entry.xp}</td>
                  <td className="px-6 py-4">{entry.missionsCompleted}</td>
                  <td className="px-6 py-4">{entry.bossesDefeated}</td>
                  <td className="px-6 py-4 text-amber-400">{entry.streakDays}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
