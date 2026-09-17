"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Compass,
  Lock,
  CheckCircle2,
  Play,
  Target,
  Bot,
  ArrowRight,
  GitFork,
  Database,
  Sparkles,
  Layers,
  Check,
  Code2,
  ChevronRight
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { gameApi } from "@/lib/game-api";
import { auth } from "@/lib/auth";
import { sound } from "@/lib/sound";
import type { GameWorld, AdaptiveRecommendation } from "@/types/game";

export default function WorldMapPage() {
  const router = useRouter();
  const [worlds, setWorlds] = useState<GameWorld[]>([]);
  const [adaptive, setAdaptive] = useState<AdaptiveRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.user()) {
      router.replace("/login");
      return;
    }

    Promise.all([
      gameApi.getWorlds(),
      gameApi.getAdaptiveRecommendation().catch(() => null)
    ])
      .then(([w, ad]) => {
        setWorlds(w);
        setAdaptive(ad);
      })
      .catch(() => setError("Failed to load curriculum tracks."))
      .finally(() => setLoading(false));
  }, [router]);

  // Clean professional topic name mapping
  const getCleanTopicName = (rawName: string, order: number) => {
    if (order === 1) return "Track 01 · Arrays & Linear Traversal";
    if (order === 2) return "Track 02 · Searching & Two Pointers";
    if (order === 3) return "Track 03 · Hash Tables & Frequency Maps";
    return `Track 0${order} · ${rawName}`;
  };

  const getCleanTopicDesc = (order: number, desc: string) => {
    if (order === 1) return "Master continuous memory indexing, in-place swaps, prefix accumulators, and boundary guards.";
    if (order === 2) return "Learn inward converging pointers, window boundaries, monotonic properties, and logarithmic binary search.";
    if (order === 3) return "Trade space for constant time O(1) lookups, hash collision strategies, and complement index matching.";
    return desc;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <GameNav />
        <main className="grid min-h-[70vh] place-items-center text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <Bot className="h-4 w-4 animate-spin text-indigo-400" />
            <span>Loading structured curriculum...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <GameNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 text-xs text-zinc-400">
                <Compass className="h-3.5 w-3.5 text-indigo-400" />
                <span>Structured Curriculum Map</span>
              </div>
              <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Learning Paths
              </h1>
              <p className="mt-1 text-xs text-zinc-400">
                Deliberate pedagogical progression: Learn &rarr; Practice &rarr; Apply &rarr; Master.
              </p>
            </div>

            {adaptive && (
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 px-4 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-indigo-300">Recommended Next Step:</span>
                  <span className="font-bold text-white">{adaptive.title}</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">{adaptive.reason}</p>
              </div>
            )}
          </div>
        </section>

        {/* Tracks List */}
        <div className="space-y-8">
          {worlds.map((world) => {
            const isUnlocked = world.unlocked;
            const completedCount = world.missions.filter((m) => m.completed).length;
            const totalCount = world.missions.length;
            const masteryPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <section
                key={world.id}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isUnlocked
                    ? "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
                    : "border-zinc-800/60 bg-zinc-950/40 opacity-70"
                }`}
              >
                {/* Track Header */}
                <div className="border-b border-zinc-800/80 bg-zinc-900/70 p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-indigo-400">
                          {getCleanTopicName(world.name, world.order)}
                        </span>
                        {!isUnlocked && (
                          <span className="flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                            <Lock className="h-3 w-3" />
                            <span>Unlocks at Level {world.requiredLevel}</span>
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-zinc-300 max-w-3xl">
                        {getCleanTopicDesc(world.order, world.description)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">
                          {masteryPct}% Mastery
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {completedCount} of {totalCount} lessons verified
                        </div>
                      </div>
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${masteryPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lessons & Practice Items */}
                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {world.missions.map((mission) => {
                      const isMissionAvailable = isUnlocked && mission.unlocked;
                      return (
                        <div
                          key={mission.id}
                          className={`flex flex-col justify-between rounded-xl border p-4 transition ${
                            mission.completed
                              ? "border-emerald-500/30 bg-emerald-950/10"
                              : isMissionAvailable
                              ? "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                              : "border-zinc-800/40 bg-zinc-950/30 opacity-50"
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                                {mission.difficulty} · {mission.order === 1 ? "Learn" : mission.order === 2 ? "Practice" : "Apply"}
                              </span>
                              {mission.completed ? (
                                <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-400">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  <span>Mastered</span>
                                </span>
                              ) : !isMissionAvailable ? (
                                <Lock className="h-3.5 w-3.5 text-zinc-600" />
                              ) : null}
                            </div>

                            <h4 className="mt-2 text-sm font-semibold text-white">
                              {mission.title}
                            </h4>
                            <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                              {mission.objective}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
                            <span className="text-[11px] text-zinc-500">
                              Reward: <span className="font-mono text-zinc-300">+{mission.xpReward} XP</span>
                            </span>
                            {isMissionAvailable ? (
                              <Link
                                href={`/missions/${mission.id}`}
                                onClick={() => sound.playClick()}
                                className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium transition ${
                                  mission.completed
                                    ? "border border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                                    : "bg-indigo-600 text-white hover:bg-indigo-500"
                                }`}
                              >
                                <span>{mission.completed ? "Review" : "Solve"}</span>
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Link>
                            ) : (
                              <span className="text-[11px] text-zinc-600">Prerequisite locked</span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Mastery Milestone Gate (Replaced Boss Fight) */}
                    {world.bossBattleId && (
                      <div className="flex flex-col justify-between rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="rounded-md bg-indigo-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-300 uppercase">
                              Mastery Milestone
                            </span>
                            <Target className="h-4 w-4 text-indigo-400" />
                          </div>
                          <h4 className="mt-2 text-sm font-bold text-white">
                            4-Stage Certification Challenge
                          </h4>
                          <p className="mt-1 text-xs text-zinc-300 leading-relaxed">
                            Diagnose, Fix, Optimize, and Explain. Verifies true competence before topic advancement.
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-indigo-500/20 flex items-center justify-between">
                          <span className="text-[11px] text-indigo-300 font-mono">
                            4 Evaluation Stages
                          </span>
                          <Link
                            href={`/boss/${world.bossBattleId}`}
                            onClick={() => sound.playClick()}
                            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-500"
                          >
                            <span>Launch Challenge</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
