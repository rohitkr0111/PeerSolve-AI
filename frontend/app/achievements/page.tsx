"use client";

import { useEffect, useState } from "react";
import {
  Award,
  Lock,
  CheckCircle2,
  Crosshair,
  Zap,
  Skull,
  Gauge,
  Shield,
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { Loading } from "@/components/loading";
import { gameApi } from "@/lib/game-api";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import type { Achievement } from "@/types/game";

export default function AchievementsPage() {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user()) {
      router.replace("/login");
      return;
    }
    gameApi
      .getAchievements()
      .then((data) => setAchievements(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const getIcon = (iconName: string, unlocked: boolean) => {
    const cls = `h-7 w-7 ${unlocked ? "text-amber-400" : "text-slate-600"}`;
    switch (iconName) {
      case "Crosshair":
        return <Crosshair className={cls} />;
      case "Zap":
        return <Zap className={cls} />;
      case "Skull":
        return <Skull className={cls} />;
      case "Gauge":
        return <Gauge className={cls} />;
      case "Shield":
        return <Shield className={cls} />;
      default:
        return <Award className={cls} />;
    }
  };

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case "LEGENDARY":
        return "border-amber-500/50 bg-amber-500/10 text-amber-300";
      case "EPIC":
        return "border-purple-500/50 bg-purple-500/10 text-purple-300";
      case "RARE":
        return "border-cyan-500/50 bg-cyan-500/10 text-cyan-300";
      default:
        return "border-slate-700 bg-slate-800 text-slate-300";
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <GameNav />
        <main>
          <Loading message="RETRIEVING TROPHY VAULT ARCHIVES..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <GameNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold text-amber-300">
              <Award className="h-3.5 w-3.5" />
              <span>TACTICAL HONORS &amp; BADGES</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Trophy Vault
            </h1>
          </div>
          <div className="flex items-center gap-3 font-mono text-xs">
            <span className="text-slate-400">VAULT COMPLETION:</span>
            <span className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1 font-bold text-amber-300">
              {unlockedCount} / {achievements.length} UNLOCKED
            </span>
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`relative flex flex-col justify-between rounded-3xl border p-6 transition-all ${
                ach.unlocked
                  ? "border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/10 shadow-lg shadow-amber-950/20"
                  : "border-slate-800/60 bg-slate-950/40 opacity-50"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${
                    ach.unlocked
                      ? "border-amber-500/40 bg-amber-950/30 shadow-inner"
                      : "border-slate-800 bg-slate-900"
                  }`}>
                    {getIcon(ach.icon, ach.unlocked)}
                  </div>
                  <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${getRarityBadge(ach.rarity)}`}>
                    {ach.rarity}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-100">
                  {ach.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  {ach.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800/80 pt-4 font-mono text-xs">
                <span className="text-cyan-400">+{ach.xpReward} XP</span>
                {ach.unlocked ? (
                  <span className="flex items-center gap-1 font-bold text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>CLAIMED</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-slate-600">
                    <Lock className="h-3.5 w-3.5" />
                    <span>LOCKED</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
