"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  ArrowRight,
  Code2,
  Compass,
  BrainCircuit,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Zap,
  Target,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { gameApi } from "@/lib/game-api";
import { auth } from "@/lib/auth";
import { sound } from "@/lib/sound";
import api from "@/lib/api";
import type { PlayerProfile, AdaptiveRecommendation } from "@/types/game";
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
  const [adaptive, setAdaptive] = useState<AdaptiveRecommendation | null>(null);
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
      gameApi.getAdaptiveRecommendation().catch(() => null),
      api.get<PracticeStats>("/api/dashboard/stats").then((r) => r.data).catch(() => null)
    ])
      .then(([userData, profileData, adaptiveData, statsData]) => {
        if (userData) setUser(userData);
        if (profileData) setProfile(profileData);
        if (adaptiveData) setAdaptive(adaptiveData);
        if (statsData) setStats(statsData);
      })
      .finally(() => setLoading(false));
  }, [router]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user?.name?.split(" ")[0] || profile?.username || "Student";

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <GameNav />
        <main className="grid min-h-[70vh] place-items-center text-xs text-zinc-400">
          Loading learning dashboard...
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <GameNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome Header */}
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 text-xs text-zinc-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Active Adaptive Session</span>
              </div>
              <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {getGreeting()}, {displayName}.
              </h1>
              <p className="mt-1 text-xs text-zinc-400">
                Continue where your learning needs you.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/world"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-500"
              >
                <Compass className="h-4 w-4" />
                <span>Resume Learning Path</span>
              </Link>
              <Link
                href="/problems"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
              >
                <Code2 className="h-4 w-4" />
                <span>Practice Lab</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Priority Card: RECOMMENDED NEXT STEP */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-6 backdrop-blur-md">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-300 uppercase">
                  RECOMMENDED NEXT STEP
                </span>
                <span className="text-xs text-indigo-300 font-mono">
                  {adaptive?.difficulty || "MEDIUM"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white sm:text-xl">
                {adaptive?.title ? `Practice ${adaptive.title}` : "Practice Hashing & Complements"}
              </h2>
              <p className="text-xs text-zinc-300 leading-relaxed">
                <strong className="text-white">Reason: </strong>
                {adaptive?.reason || "You've solved array problems correctly, but your last two solutions used repeated linear scanning. Reinforce hash-based single-pass lookups."}
              </p>
            </div>

            <div className="flex shrink-0 items-center">
              <Link
                href={adaptive?.missionId ? `/missions/${adaptive.missionId}` : "/world"}
                onClick={() => sound.playClick()}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 2-Column Core: LEARNING PATTERNS & PROGRESS METRICS */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left 2 Cols: YOUR LEARNING PATTERNS */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">YOUR LEARNING PATTERNS</h3>
                </div>
                <span className="text-[11px] text-zinc-500">Live AI Diagnostics</span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Strong At */}
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Demonstrated Strengths</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Basic array traversal &amp; iteration</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Edge-case null / empty bounds handling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>Single variable accumulators</span>
                    </li>
                  </ul>
                </div>

                {/* Working On */}
                <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
                    <Target className="h-4 w-4" />
                    <span>Current Focus Areas</span>
                  </div>
                  <ul className="mt-3 space-y-1.5 text-xs text-zinc-300">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span>Hash-based complement optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span>Time complexity awareness ($O(N)$ vs $O(N^2)$)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span>Inward two-pointer bounds</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Signature Observation */}
              <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-xs">
                <span className="font-semibold text-zinc-400 uppercase tracking-wider text-[10px] block">Observed Pattern</span>
                <p className="mt-1 text-zinc-200 leading-relaxed">
                  &ldquo;You frequently reach a logically correct solution before looking for a more efficient algorithmic approach. PeerSolve is shifting focus toward space-time trade-offs.&rdquo;
                </p>
              </div>
            </section>

            {/* Curriculum Tracks Quick Access */}
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <h3 className="text-sm font-bold text-white">ACTIVE LEARNING PATHS</h3>
                <Link href="/world" className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                  View All Tracks →
                </Link>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Track 01 · Arrays &amp; Linear Traversal</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">3/4 Lessons Completed · Mastery Milestone Available</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-emerald-400">80%</span>
                    <Link href="/world" className="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700">
                      Open
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Track 02 · Searching &amp; Two Pointers</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">2/3 Lessons Completed · Boundary Invariants</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-indigo-400">60%</span>
                    <Link href="/world" className="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700">
                      Open
                    </Link>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
                  <div>
                    <h4 className="text-xs font-semibold text-white">Track 03 · Hash Tables &amp; Frequency Maps</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">1/3 Lessons Completed · Complement Lookups</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-zinc-400">30%</span>
                    <Link href="/world" className="rounded-lg bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700">
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Col: YOUR PROGRESS & METRICS */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">YOUR PROGRESS</h3>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Time Complexity Awareness</span>
                    <span className="font-mono font-bold text-emerald-400">+18%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full w-[78%]" />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Hashing Mastery</span>
                    <span className="font-mono font-bold text-indigo-400">+24%</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[64%]" />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Repeated Scanning Trend</span>
                    <span className="font-mono font-bold text-emerald-400">↓ 3 attempts</span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">Decreasing quadratic reliance on new submissions</p>
                </div>
              </div>

              {/* Overall Counts */}
              <div className="mt-6 grid grid-cols-2 gap-3 border-t border-zinc-800 pt-4 text-center">
                <div className="rounded-lg bg-zinc-950/60 p-2.5">
                  <div className="text-base font-bold text-white">{stats.problemsSolved || profile?.completedMissions?.length || 3}</div>
                  <div className="text-[10px] text-zinc-500 uppercase mt-0.5">Problems Solved</div>
                </div>
                <div className="rounded-lg bg-zinc-950/60 p-2.5">
                  <div className="text-base font-bold text-amber-400">{profile?.streakDays || 1}d</div>
                  <div className="text-[10px] text-zinc-500 uppercase mt-0.5">Learning Streak</div>
                </div>
              </div>
            </section>

            {/* Quick Practice CTA */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-center">
              <h4 className="text-xs font-bold text-white">Ready for a quick problem?</h4>
              <p className="mt-1 text-[11px] text-zinc-400">Solve individual problems with ADA-7 live coaching.</p>
              <Link
                href="/problems"
                onClick={() => sound.playClick()}
                className="mt-3 inline-flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-200 transition hover:bg-zinc-700 hover:text-white"
              >
                <span>Browse Practice Lab</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
