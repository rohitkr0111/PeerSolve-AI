"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GitBranch,
  Lock,
  CheckCircle2,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { Loading } from "@/components/loading";
import { gameApi } from "@/lib/game-api";
import { sound } from "@/lib/sound";
import { auth } from "@/lib/auth";
import type { SkillTreeNode } from "@/types/game";

export default function SkillTreePage() {
  const router = useRouter();
  const [skills, setSkills] = useState<SkillTreeNode[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<SkillTreeNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user()) {
      router.replace("/login");
      return;
    }
    gameApi
      .getSkillTree()
      .then((tree) => {
        setSkills(tree);
        if (tree.length > 0) setSelectedSkill(tree[0]);
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <GameNav />
        <main>
          <Loading message="SYNCHRONIZING NEURAL SKILL GRAPH..." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <GameNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 font-mono text-xs font-semibold text-cyan-300">
              <GitBranch className="h-3.5 w-3.5" />
              <span>PERSISTENT NEURAL PROGRESSION</span>
            </div>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-100 sm:text-4xl">
              Algorithmic Skill Tree
            </h1>
          </div>
          <p className="max-w-md text-xs text-slate-400">
            Skills unlock dynamically as you conquer missions and defeat sector Boss Guardians. Mastery scores update based on your unassisted solution telemetry.
          </p>
        </div>

        {/* Tree Layout & Detail Drawer Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Visual Nodes Grid grouped by Tier */}
          <div className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/40 p-6 backdrop-blur-md sm:p-8">
            {[1, 2, 3, 4].map((tier) => {
              const tierNodes = skills.filter((s) => s.tier === tier);
              if (tierNodes.length === 0) return null;

              return (
                <div key={tier} className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-md border border-slate-800 bg-slate-950 px-2 py-0.5 font-mono text-xs font-bold text-slate-400">
                      TIER 0{tier}
                    </span>
                    <div className="h-px flex-1 bg-slate-800" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {tierNodes.map((node) => {
                      const isSelected = selectedSkill?.id === node.id;
                      return (
                        <div
                          key={node.id}
                          onClick={() => {
                            sound.playClick();
                            setSelectedSkill(node);
                          }}
                          className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                            isSelected
                              ? "border-cyan-400 bg-cyan-950/20 shadow-lg shadow-cyan-950/30"
                              : node.status === "MASTERED"
                              ? "border-emerald-500/40 bg-emerald-950/10 hover:border-emerald-500"
                              : node.status === "AVAILABLE"
                              ? "border-slate-700 bg-slate-900/70 hover:border-cyan-500/40"
                              : "border-slate-800/40 bg-slate-950/40 opacity-40 hover:opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-slate-400">
                              {node.id}
                            </span>
                            {node.status === "MASTERED" ? (
                              <span className="flex items-center gap-1 font-mono text-xs font-bold text-emerald-400">
                                <ShieldCheck className="h-4 w-4" />
                                <span>MASTERED</span>
                              </span>
                            ) : node.status === "AVAILABLE" ? (
                              <span className="flex items-center gap-1 font-mono text-xs font-bold text-cyan-400">
                                <Zap className="h-3.5 w-3.5 fill-cyan-400" />
                                <span>UNLOCKED</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 font-mono text-xs text-slate-500">
                                <Lock className="h-3 w-3" />
                                <span>LOCKED</span>
                              </span>
                            )}
                          </div>

                          <h3 className="mt-2 text-lg font-bold text-slate-100">
                            {node.name}
                          </h3>
                          <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                            {node.description}
                          </p>

                          {/* Mastery Meter */}
                          <div className="mt-4">
                            <div className="flex justify-between font-mono text-[11px] text-slate-400">
                              <span>Mastery</span>
                              <span className={node.masteryScore >= 80 ? "text-emerald-400 font-bold" : "text-cyan-400"}>
                                {node.masteryScore}%
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  node.masteryScore >= 80
                                    ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                                    : "bg-gradient-to-r from-cyan-400 to-indigo-500"
                                }`}
                                style={{ width: `${node.masteryScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Node Deep-Dive Drawer */}
          {selectedSkill ? (
            <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  NODE SCHEMATIC
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 font-mono text-xs font-bold ${
                    selectedSkill.status === "MASTERED"
                      ? "bg-emerald-500/10 text-emerald-300"
                      : selectedSkill.status === "AVAILABLE"
                      ? "bg-cyan-500/10 text-cyan-300"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {selectedSkill.status}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-100">{selectedSkill.name}</h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {selectedSkill.description}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-500">TIER</span>
                  <p className="text-base font-bold text-slate-200">Level 0{selectedSkill.tier}</p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <span className="text-slate-500">MASTERY</span>
                  <p className="text-base font-bold text-cyan-400">{selectedSkill.masteryScore}%</p>
                </div>
              </div>

              {/* Prerequisites */}
              {selectedSkill.prerequisites.length > 0 && (
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                    Prerequisites
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSkill.prerequisites.map((p) => (
                      <span
                        key={p}
                        className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 font-mono text-xs text-slate-300"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sector Link */}
              <div className="pt-2">
                <Link
                  href="/world"
                  onClick={() => sound.playClick()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 py-3 font-mono text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-90"
                >
                  <span>DEPLOY MISSIONS IN SECTOR</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
