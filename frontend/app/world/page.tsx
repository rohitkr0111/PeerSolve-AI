"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Globe,
  Lock,
  CheckCircle2,
  Play,
  Skull,
  Bot,
  Zap,
  ArrowRight,
  ShieldAlert,
  Cpu,
  GitFork,
  Database
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { Loading } from "@/components/loading";
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
      .catch(() => setError("Failed to load neural sector maps."))
      .finally(() => setLoading(false));
  }, [router]);

  const getSectorIcon = (iconName: string) => {
    switch (iconName) {
      case "GitFork":
        return <GitFork className="h-6 w-6 text-indigo-400" />;
      case "Database":
        return <Database className="h-6 w-6 text-emerald-400" />;
      default:
        return <Cpu className="h-6 w-6 text-cyan-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <GameNav />
        <main>
          <Loading message="CALIBRATING SECTOR TELEMETRY..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <GameNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Adaptive AI Target Banner */}
        {adaptive && (
          <section className="mb-8 overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 p-5 shadow-lg shadow-cyan-950/30 backdrop-blur-md">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/40 bg-cyan-500/10 text-cyan-300">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold tracking-wider text-cyan-400">
                      ADA-7 TARGET RECOMMENDATION
                    </span>
                    <span className="rounded bg-cyan-400/20 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-300 uppercase">
                      {adaptive.difficulty}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100">{adaptive.title}</h3>
                  <p className="text-xs text-slate-400">{adaptive.reason}</p>
                </div>
              </div>

              {adaptive.missionId && (
                <Link
                  href={adaptive.difficulty === "BOSS" ? `/boss/${adaptive.missionId}` : `/missions/${adaptive.missionId}`}
                  onClick={() => sound.playClick()}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-2.5 font-mono text-xs font-bold text-slate-950 shadow-md shadow-cyan-500/20 transition hover:opacity-90"
                >
                  <span>DEPLOY TARGET</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </section>
        )}

        {/* Sectors Header */}
        <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              TACTICAL CAMPAIGN
            </p>
            <h1 className="mt-1 text-3xl font-extrabold text-slate-100 sm:text-4xl">
              Learning Sectors
            </h1>
          </div>
          <p className="text-xs text-slate-400">
            Conquer node challenges in sequence to breach and dismantle sector Boss Guardians.
          </p>
        </div>

        {error && <p className="mb-6 text-sm text-rose-400">{error}</p>}

        {/* Worlds Grid */}
        <div className="space-y-8">
          {worlds.map((world) => (
            <div
              key={world.id}
              className={`relative overflow-hidden rounded-3xl border transition-all ${
                world.unlocked
                  ? "border-slate-800 bg-slate-900/40 backdrop-blur-md hover:border-slate-700"
                  : "border-slate-900 bg-slate-950/60 opacity-65"
              }`}
            >
              {/* World Header */}
              <div className="border-b border-slate-800/80 p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-700 bg-slate-900">
                      {getSectorIcon(world.badgeIcon)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-bold text-slate-100">{world.name}</h2>
                        {!world.unlocked ? (
                          <span className="flex items-center gap-1 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 font-mono text-xs font-semibold text-slate-400">
                            <Lock className="h-3 w-3" />
                            <span>REQ LVL {world.requiredLevel}</span>
                          </span>
                        ) : world.bossDefeated ? (
                          <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>SECTOR LIBERATED</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 font-mono text-xs font-semibold text-cyan-400">
                            <span>SECTOR ACTIVE</span>
                          </span>
                        )}
                      </div>
                      <p className="mt-1 font-medium text-cyan-400/90">{world.subtitle}</p>
                      <p className="mt-2 max-w-2xl text-xs leading-relaxed text-slate-400">
                        {world.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress Ring / Bar */}
                  <div className="flex flex-col items-end gap-1 font-mono sm:min-w-[160px]">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      <span>PROGRESS: {world.progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                        style={{ width: `${world.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {world.completedMissionsCount} of {world.totalMissionsCount} Nodes Cleared
                    </span>
                  </div>
                </div>
              </div>

              {/* Missions & Boss in this Sector */}
              <div className="p-6 sm:p-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {world.missions.map((mission) => (
                    <div
                      key={mission.id}
                      className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                        mission.completed
                          ? "border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50"
                          : mission.unlocked
                          ? "border-slate-800 bg-slate-900/60 hover:-translate-y-1 hover:border-cyan-500/40 hover:shadow-lg hover:shadow-cyan-950/20"
                          : "border-slate-800/40 bg-slate-950/40 opacity-50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-slate-500">
                            NODE 0{mission.order}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                                mission.difficulty === "EASY"
                                  ? "bg-emerald-500/10 text-emerald-300"
                                  : mission.difficulty === "MEDIUM"
                                  ? "bg-amber-500/10 text-amber-300"
                                  : "bg-rose-500/10 text-rose-300"
                              }`}
                            >
                              {mission.difficulty}
                            </span>
                            {mission.completed && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            )}
                          </div>
                        </div>

                        <h3 className="mt-3 text-base font-bold text-slate-100 group-hover:text-cyan-300">
                          {mission.title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400">
                          {mission.objective}
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4 font-mono text-xs">
                        <span className="text-cyan-400">+{mission.xpReward} XP</span>
                        {mission.unlocked ? (
                          <Link
                            href={`/missions/${mission.id}`}
                            onClick={() => sound.playClick()}
                            className="flex items-center gap-1 font-bold text-slate-300 transition-colors group-hover:text-cyan-400"
                          >
                            <span>{mission.completed ? "Replay" : "Deploy"}</span>
                            <Play className="h-3 w-3 fill-current" />
                          </Link>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Lock className="h-3 w-3" />
                            <span>Locked</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Boss Battle Gate Card */}
                  {world.bossBattleId && (
                    <div
                      className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                        world.bossDefeated
                          ? "border-emerald-500/40 bg-emerald-950/20"
                          : world.completedMissionsCount >= world.totalMissionsCount && world.totalMissionsCount > 0
                          ? "border-rose-500/50 bg-gradient-to-br from-rose-950/30 to-slate-900 shadow-xl shadow-rose-950/30 animate-pulse"
                          : "border-slate-800/50 bg-slate-950/60 opacity-60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-bold text-rose-400">
                            BOSS GUARDIAN
                          </span>
                          <Skull className={`h-5 w-5 ${world.bossDefeated ? "text-emerald-400" : "text-rose-400"}`} />
                        </div>

                        <h3 className="mt-3 text-base font-bold text-slate-100">
                          The Chrono-Consumer
                        </h3>
                        <p className="mt-2 text-xs text-slate-400">
                          Multi-Stage Boss Battle. Dismantle its 4 subroutines to liberate the sector.
                        </p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4 font-mono text-xs">
                        <span className="text-amber-400">+500 XP BONUS</span>
                        {world.completedMissionsCount >= world.totalMissionsCount && world.totalMissionsCount > 0 ? (
                          <Link
                            href={`/boss/${world.bossBattleId}`}
                            onClick={() => sound.playClick()}
                            className="flex items-center gap-1.5 rounded-lg bg-rose-500 px-3 py-1 font-bold text-slate-950 transition hover:bg-rose-400"
                          >
                            <Skull className="h-3.5 w-3.5" />
                            <span>Fight Boss</span>
                          </Link>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Lock className="h-3 w-3" />
                            <span>Clear Nodes</span>
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
