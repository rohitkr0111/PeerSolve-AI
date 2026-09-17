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
  Bot,
  Sparkles,
  Check
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
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
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <GameNav />
        <main className="grid min-h-[70vh] place-items-center text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <Bot className="h-4 w-4 animate-spin text-indigo-400" />
            <span>Calibrating skill dependency graph...</span>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <GameNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 text-xs text-zinc-400">
            <GitBranch className="h-3.5 w-3.5 text-indigo-400" />
            <span>Algorithmic Competencies</span>
          </div>
          <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Skill &amp; Concept Dependency Graph
          </h1>
          <p className="mt-1 text-xs text-zinc-400">
            Visual hierarchy of data structure principles, algorithmic optimizations, and unlocked competencies.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Main Graph Grid (8 cols) */}
          <div className="space-y-4 lg:col-span-8">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {skills.map((skill) => {
                const isSelected = selectedSkill?.id === skill.id;
                const isMastered = skill.status === "MASTERED";
                const isAvailable = skill.status === "AVAILABLE";

                return (
                  <button
                    key={skill.id}
                    onClick={() => {
                      sound.playClick();
                      setSelectedSkill(skill);
                    }}
                    className={`flex flex-col justify-between rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-950/30 text-white shadow-sm shadow-indigo-500/10"
                        : isMastered
                        ? "border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/50"
                        : isAvailable
                        ? "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900"
                        : "border-zinc-800/40 bg-zinc-950/40 opacity-50"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                          Tier {skill.tier}
                        </span>
                        {isMastered ? (
                          <span className="flex items-center gap-1 font-mono text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>100% Mastered</span>
                          </span>
                        ) : isAvailable ? (
                          <span className="font-mono text-[11px] font-semibold text-indigo-400">
                            {skill.masteryScore}% Mastery
                          </span>
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-zinc-600" />
                        )}
                      </div>

                      <h3 className="mt-3 text-sm font-semibold text-white">
                        {skill.name}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {skill.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-zinc-800/60">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isMastered ? "bg-emerald-500" : "bg-indigo-500"
                          }`}
                          style={{ width: `${skill.masteryScore}%` }}
                        />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Skill Detail Panel (4 cols) */}
          <div className="lg:col-span-4">
            {selectedSkill ? (
              <div className="sticky top-20 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md space-y-5">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-zinc-400">
                      Tier {selectedSkill.tier} Concept
                    </span>
                    <span className={`font-mono text-xs font-bold ${
                      selectedSkill.status === "MASTERED" ? "text-emerald-400" : "text-indigo-400"
                    }`}>
                      {selectedSkill.masteryScore}%
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-bold text-white">
                    {selectedSkill.name}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                    {selectedSkill.description}
                  </p>
                </div>

                {selectedSkill.prerequisites && selectedSkill.prerequisites.length > 0 && (
                  <div className="border-t border-zinc-800/80 pt-4">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                      Prerequisites
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSkill.prerequisites.map((p) => (
                        <span key={p} className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[10px] text-zinc-400">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-zinc-800/80 pt-4">
                  <Link
                    href="/world"
                    onClick={() => sound.playClick()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500"
                  >
                    <span>Practice in Curriculum</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center text-xs text-zinc-500">
                Select a skill node to view details and prerequisites.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
