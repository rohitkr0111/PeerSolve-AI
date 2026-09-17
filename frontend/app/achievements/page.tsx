"use client";

import { useEffect, useState } from "react";
import {
  Award,
  Lock,
  CheckCircle2,
  Crosshair,
  Zap,
  Target,
  Gauge,
  Shield,
  Bot
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
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
    const cls = `h-5 w-5 ${unlocked ? "text-indigo-400" : "text-zinc-600"}`;
    switch (iconName) {
      case "Crosshair":
        return <Crosshair className={cls} />;
      case "Zap":
        return <Zap className={cls} />;
      case "Skull":
        return <Target className={cls} />;
      case "Gauge":
        return <Gauge className={cls} />;
      case "Shield":
        return <Shield className={cls} />;
      default:
        return <Award className={cls} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <GameNav />
        <main className="grid min-h-[70vh] place-items-center text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <Bot className="h-4 w-4 animate-spin text-indigo-400" />
            <span>Loading certifications...</span>
          </div>
        </main>
      </div>
    );
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <GameNav />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 text-xs text-zinc-400">
              <Award className="h-3.5 w-3.5 text-indigo-400" />
              <span>Verified Competencies</span>
            </div>
            <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Certifications &amp; Milestones
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Milestone badges awarded for unassisted solutions, complexity optimizations, and streak discipline.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-2 text-xs font-mono text-zinc-300">
            <span className="text-indigo-400 font-bold">{unlockedCount}</span> of {achievements.length} Certifications Earned
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition ${
                item.unlocked
                  ? "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                  : "border-zinc-800/40 bg-zinc-950/40 opacity-60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                    item.unlocked ? "border-indigo-500/30 bg-indigo-600/10" : "border-zinc-800 bg-zinc-950"
                  }`}>
                    {getIcon(item.icon, item.unlocked)}
                  </div>
                  {item.unlocked ? (
                    <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Certified</span>
                    </span>
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-zinc-600" />
                  )}
                </div>

                <h3 className="mt-3.5 text-sm font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between font-mono text-[11px] text-zinc-500">
                <span>Reward</span>
                <span className="text-indigo-400 font-bold">+{item.xpReward} XP</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
