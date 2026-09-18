"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Zap,
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
import { Loading } from "@/components/loading";
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
      <div className="min-h-screen bg-[#f5f3ee] text-[#121212]">
        <GameNav />
        <main>
          <Loading message="Loading your command center..." />
        </main>
      </div>
    );
  }

  const completedCount = profile?.completedMissions?.length || 0;
  const streakDays = profile?.streakDays || 1;
  const currentXp = profile?.xp || 0;
  const nextLevelXp = profile?.xpForNextLevel || 100;
  const currentLevelXp = profile?.xpForCurrentLevel || 0;
  const xpProgress = Math.min(
    100,
    Math.max(
      8,
      ((currentXp - currentLevelXp) / Math.max(1, nextLevelXp - currentLevelXp)) * 100
    )
  );

  return (
    <div className="min-h-screen bg-[#f5f3ee] text-[#121212]">
      <GameNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Welcome Hero / Mission Control */}
        <section className="relative overflow-hidden rounded-3xl border border-[#dedbd3] bg-white p-6 shadow-sm sm:p-10 lg:p-12">
          {/* Subtle Warm Accent Tints */}
          <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[#8fa85a]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 right-1/4 h-56 w-56 rounded-full bg-[#c7b89a]/15 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-[#121212] px-3 py-1 font-mono text-xs font-bold text-white">
                  <span className="h-2 w-2 rounded-full bg-[#8fa85a] animate-pulse" />
                  ONLINE
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#c7b89a]/20 px-3 py-1 font-mono text-xs font-semibold text-[#6f6d67]">
                  <Flame className="h-3.5 w-3.5 fill-[#b86f5d] text-[#b86f5d]" />
                  {streakDays} Day Streak
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#dedbd3]/40 px-3 py-1 font-mono text-xs font-semibold text-[#6f6d67]">
                  LVL {profile?.level || 1}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-[-.06em] text-[#121212] sm:text-5xl lg:text-[3.25rem] leading-[1.05]">
                Welcome back, <span className="text-[#121212] underline decoration-[#8fa85a] decoration-4 underline-offset-4">{user?.name || profile?.username || "Player"}</span>
              </h1>
              <p className="mt-3 max-w-xl text-base text-[#6f6d67] sm:text-lg leading-relaxed">
                Your personal mission control. Track algorithmic mastery, tackle curriculum missions, and test your skills in real-time.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/world"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2.5 rounded-full bg-[#121212] px-7 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#2a2a2a] hover:-translate-y-0.5"
              >
                <Play className="h-4 w-4 fill-current text-[#8fa85a]" />
                <span>Continue Campaign</span>
              </Link>
              <Link
                href="/boss/boss-chrono-consumer"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 rounded-full border border-[#dedbd3] bg-[#f5f3ee] px-6 py-4 text-sm font-bold text-[#121212] transition hover:bg-white hover:-translate-y-0.5"
              >
                <Skull className="h-4 w-4 text-[#b86f5d]" />
                <span>Boss Arena</span>
              </Link>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="relative z-10 mt-8 border-t border-[#dedbd3] pt-6">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-[#6f6d67]">
              <span className="flex items-center gap-1.5 font-bold text-[#121212]">
                <Zap className="h-4 w-4 fill-[#8fa85a] text-[#8fa85a]" />
                LEVEL {profile?.level || 1} PROGRESS
              </span>
              <span>
                <strong className="font-bold text-[#121212]">{currentXp}</strong> / {nextLevelXp} XP ({nextLevelXp - currentXp} XP to Level {(profile?.level || 1) + 1})
              </span>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#dedbd3]">
              <div
                className="h-full rounded-full bg-[#8fa85a] transition-all duration-700"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
          </div>
        </section>

        {/* Tactical Metrics Grid */}
        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-[-.04em] text-[#121212] sm:text-2xl">
              Performance Snapshot
            </h2>
            <span className="text-xs font-semibold text-[#6F6D67]">Real-time overview</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Stat 1: Total XP */}
            <div className="group rounded-3xl border border-[#dedbd3] bg-white p-6 shadow-sm transition hover:border-[#121212]/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6f6d67]">Total Score</span>
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#8fa85a]/15 text-[#8fa85a]">
                  <Zap className="h-4 w-4 fill-current" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-[#121212] sm:text-4xl">
                {currentXp} <span className="text-base font-bold text-[#6f6d67]">XP</span>
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6f6d67]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8fa85a]" />
                <span>Level {profile?.level || 1} ranking</span>
              </div>
            </div>

            {/* Stat 2: Missions Cleared */}
            <div className="group rounded-3xl border border-[#dedbd3] bg-white p-6 shadow-sm transition hover:border-[#121212]/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6f6d67]">Missions Cleared</span>
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#8fa85a]/15 text-[#8fa85a]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-[#121212] sm:text-4xl">
                {completedCount}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6f6d67]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8fa85a]" />
                <span>Across active curriculums</span>
              </div>
            </div>

            {/* Stat 3: Bosses / Milestones */}
            <div className="group rounded-3xl border border-[#dedbd3] bg-white p-6 shadow-sm transition hover:border-[#121212]/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6f6d67]">Bosses Slain</span>
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#b86f5d]/15 text-[#b86f5d]">
                  <Skull className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-[#121212] sm:text-4xl">
                {profile?.defeatedBosses?.length || 0}
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6f6d67]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#b86f5d]" />
                <span>Multi-stage milestones</span>
              </div>
            </div>

            {/* Stat 4: Acceptance Rate */}
            <div className="group rounded-3xl border border-[#dedbd3] bg-white p-6 shadow-sm transition hover:border-[#121212]/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6f6d67]">Acceptance Rate</span>
                <div className="grid h-9 w-9 place-items-center rounded-2xl bg-[#c7b89a]/30 text-[#6f6d67]">
                  <Code2 className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tight text-[#121212] sm:text-4xl">
                {stats.acceptanceRate}%
              </p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6f6d67]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8fa85a]" />
                <span>{stats.problemsSolved} / {stats.problemsAttempted} Practice runs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Feature Hub */}
        <section className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-black tracking-[-.04em] text-[#121212] sm:text-2xl">
              Curriculum &amp; Progression
            </h2>
            <span className="text-xs font-semibold text-[#6f6d67]">Interactive tracks</span>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {/* Card 1: Skill Tree */}
            <Link
              href="/skill-tree"
              onClick={() => sound.playClick()}
              className="group flex flex-col justify-between rounded-3xl border border-[#dedbd3] bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#121212]/20"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#8fa85a]/15 text-[#8fa85a] transition-transform duration-200 group-hover:scale-105">
                  <GitBranch className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight text-[#121212]">
                  Algorithmic Skill Tree
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6f6d67]">
                  Visualize concept mastery across Arrays, Two Pointers, Trees, and Dynamic Programming.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#dedbd3] pt-4">
                <span className="text-xs font-bold text-[#121212]">Explore Map</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-black/5 text-[#121212] transition-colors group-hover:bg-[#121212] group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* Card 2: Leaderboard */}
            <Link
              href="/leaderboard"
              onClick={() => sound.playClick()}
              className="group flex flex-col justify-between rounded-3xl border border-[#dedbd3] bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#121212]/20"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#c7b89a]/30 text-[#6f6d67] transition-transform duration-200 group-hover:scale-105">
                  <Trophy className="h-6 w-6 text-[#6f6d67]" />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight text-[#121212]">
                  Global Leaderboard
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6f6d67]">
                  Benchmark your velocity, solved challenges, and XP gains against fellow engineers globally.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#dedbd3] pt-4">
                <span className="text-xs font-bold text-[#121212]">Inspect Standings</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-black/5 text-[#121212] transition-colors group-hover:bg-[#121212] group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* Card 3: Badges / Vault */}
            <Link
              href="/achievements"
              onClick={() => sound.playClick()}
              className="group flex flex-col justify-between rounded-3xl border border-[#dedbd3] bg-white p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#121212]/20"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#b86f5d]/15 text-[#b86f5d] transition-transform duration-200 group-hover:scale-105">
                  <Award className="h-6 w-6 text-[#b86f5d]" />
                </div>
                <h3 className="mt-5 text-xl font-black tracking-tight text-[#121212]">
                  Trophy &amp; Badge Vault
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6f6d67]">
                  Unlock special achievement honors, streak badges, and milestone trophies as you advance.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#dedbd3] pt-4">
                <span className="text-xs font-bold text-[#121212]">Open Vault</span>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-black/5 text-[#121212] transition-colors group-hover:bg-[#121212] group-hover:text-white">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
