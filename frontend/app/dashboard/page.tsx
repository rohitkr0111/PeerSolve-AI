"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
  Globe,
  GitBranch,
  Skull,
  Trophy,
  Award,
  Flame,
  CheckCircle2,
  ArrowRight,
  Code2,
  Play
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { gameApi } from "@/lib/game-api";
import { auth } from "@/lib/auth";
import { sound } from "@/lib/sound";
import api from "@/lib/api";
import type { PlayerProfile } from "@/types/game";
import type { User } from "@/types/auth";

interface PracticeStats {
  problemsSolved: number;
  problemsAttempted: number;
  acceptanceRate: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [stats, setStats] = useState<PracticeStats>({
    problemsSolved: 0,
    problemsAttempted: 0,
    acceptanceRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user()) {
      router.replace("/login");
      return;
    }

    Promise.all([
      api.get<User>("/api/users/me").then((r) => r.data).catch(() => null),
      gameApi.getProfile().catch(() => null),
      api.get<PracticeStats>("/api/dashboard/stats").then((r) => r.data).catch(() => null)
    ])
      .then(([userData, profileData, statsData]) => {
        if (userData) setUser(userData);
        if (profileData) setProfile(profileData);
        if (statsData) setStats(statsData);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <GameNav />
        <main className="grid min-h-[70vh] place-items-center font-mono text-sm text-cyan-400">
          INITIALIZING PLAYER COMMAND TELEMETRY...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <GameNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome Hero Card */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/30 p-6 shadow-2xl backdrop-blur-md sm:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-0.5 font-mono text-xs font-bold text-cyan-400">
                  PLAYER STATUS: ONLINE
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-amber-400">
                  <Flame className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{profile?.streakDays || 1} Day Streak</span>
                </span>
              </div>
              <h1 className="mt-3 text-3xl font-black text-slate-100 sm:text-5xl">
                Command Center: {user?.name || profile?.username || "Player"}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Your neural link is synchronized. Level {profile?.level || 1} Algorithmic Agent.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/world"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3.5 font-mono text-xs font-bold text-slate-950 shadow-xl shadow-cyan-500/20 transition hover:opacity-90"
              >
                <Play className="h-4 w-4 fill-slate-950" />
                <span>CONTINUE CAMPAIGN</span>
              </Link>
              <Link
                href="/boss/boss-chrono-consumer"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-6 py-3.5 font-mono text-xs font-bold text-rose-300 transition hover:bg-rose-500/20"
              >
                <Skull className="h-4 w-4" />
                <span>BOSS ARENA</span>
              </Link>
            </div>
          </div>

          {/* XP Progress Bar in Banner */}
          {profile && (
            <div className="mt-8 border-t border-slate-800 pt-6">
              <div className="flex justify-between font-mono text-xs text-slate-300">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Zap className="h-3.5 w-3.5 fill-cyan-400" />
                  <span>LEVEL {profile.level}</span>
                </span>
                <span>
                  {profile.xp} / {profile.xpForNextLevel} XP (Next Level: {profile.xpForNextLevel - profile.xp} XP)
                </span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        5,
                        ((profile.xp - profile.xpForCurrentLevel) /
                          Math.max(1, profile.xpForNextLevel - profile.xpForCurrentLevel)) *
                          100
                      )
                    )}%`
                  }}
                />
              </div>
            </div>
          )}
        </section>

        {/* Tactical Metrics Grid */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">TOTAL SCORE</span>
              <Zap className="h-5 w-5 text-cyan-400" />
            </div>
            <p className="mt-3 font-mono text-3xl font-extrabold text-slate-100">
              {profile?.xp || 0} <span className="text-xs text-cyan-400">XP</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Persisted in MongoDB</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">MISSIONS CLEARED</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            </div>
            <p className="mt-3 font-mono text-3xl font-extrabold text-slate-100">
              {profile?.completedMissions.length || 0}
            </p>
            <p className="mt-1 text-xs text-slate-500">Across active sectors</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">BOSSES SLAIN</span>
              <Skull className="h-5 w-5 text-rose-400" />
            </div>
            <p className="mt-3 font-mono text-3xl font-extrabold text-slate-100">
              {profile?.defeatedBosses.length || 0}
            </p>
            <p className="mt-1 text-xs text-slate-500">Multi-stage guardians</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-slate-400">ACCEPTANCE RATE</span>
              <Code2 className="h-5 w-5 text-amber-400" />
            </div>
            <p className="mt-3 font-mono text-3xl font-extrabold text-slate-100">
              {stats.acceptanceRate}%
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {stats.problemsSolved} / {stats.problemsAttempted} Practice runs
            </p>
          </div>
        </section>

        {/* Quick Launch Cards */}
        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href="/skill-tree"
            onClick={() => sound.playClick()}
            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:-translate-y-1 hover:border-cyan-500/40"
          >
            <GitBranch className="h-8 w-8 text-cyan-400 group-hover:scale-110 transition-transform" />
            <h3 className="mt-4 text-lg font-bold text-slate-100">Algorithmic Skill Tree</h3>
            <p className="mt-1 text-xs text-slate-400">
              Inspect your unlocked nodes and domain mastery percentages.
            </p>
            <div className="mt-4 flex items-center gap-1 font-mono text-xs text-cyan-400">
              <span>View Tree</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/leaderboard"
            onClick={() => sound.playClick()}
            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:-translate-y-1 hover:border-amber-500/40"
          >
            <Trophy className="h-8 w-8 text-amber-400 group-hover:scale-110 transition-transform" />
            <h3 className="mt-4 text-lg font-bold text-slate-100">Global Leaderboard</h3>
            <p className="mt-1 text-xs text-slate-400">
              Check your rank on the live leaderboard compared to other cyber-agents.
            </p>
            <div className="mt-4 flex items-center gap-1 font-mono text-xs text-amber-400">
              <span>Inspect Rankings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>

          <Link
            href="/achievements"
            onClick={() => sound.playClick()}
            className="group rounded-2xl border border-slate-800 bg-slate-900/40 p-6 transition hover:-translate-y-1 hover:border-purple-500/40"
          >
            <Award className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
            <h3 className="mt-4 text-lg font-bold text-slate-100">Trophy Vault</h3>
            <p className="mt-1 text-xs text-slate-400">
              View unlocked honors, badges, and rarity ratings for your milestones.
            </p>
            <div className="mt-4 flex items-center gap-1 font-mono text-xs text-purple-400">
              <span>Open Vault</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        </section>
      </main>
    </div>
  );
}
