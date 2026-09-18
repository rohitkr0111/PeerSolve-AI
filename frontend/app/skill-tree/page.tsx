"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GitBranch,
  Lock,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  BookOpen
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
      <div className="min-h-screen bg-[#F5F3EE] text-[#151515]">
        <GameNav />
        <main>
          <Loading message="Loading curriculum skill tree..." />
        </main>
      </div>
    );
  }

  const masteredCount = skills.filter((s) => s.status === "MASTERED").length;
  const availableCount = skills.filter((s) => s.status === "AVAILABLE" || s.status === "MASTERED").length;
  const totalCount = skills.length;

  return (
    <div className="min-h-screen bg-[#F5F3EE] text-[#151515]">
      <GameNav />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Header Section */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#DEDAD2] bg-white px-3 py-1 text-xs font-semibold text-[#6F6D67]">
              <GitBranch className="h-3.5 w-3.5 text-[#87965A]" />
              <span>Adaptive Curriculum</span>
            </div>
            <h1 className="mt-3 text-3xl font-black tracking-[-.06em] text-[#151515] sm:text-4xl lg:text-5xl">
              Algorithmic Skill Tree
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6F6D67] sm:text-base">
              Track your concept mastery. Skills unlock progressively as you practice problems and clear milestone challenges.
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-[#DEDAD2] bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F6D67]">Overall Progress</span>
              <span className="text-lg font-black text-[#151515]">
                {masteredCount} / {totalCount} <span className="text-xs font-semibold text-[#6F6D67]">Mastered</span>
              </span>
            </div>
            <div className="h-8 w-px bg-[#DEDAD2]" />
            <div className="flex flex-col">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F6D67]">Unlocked</span>
              <span className="text-lg font-black text-[#87965A]">
                {availableCount} <span className="text-xs font-semibold text-[#6F6D67]">Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Tree Layout & Detail Drawer Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Visual Nodes Grid grouped by Tier */}
          <div className="space-y-8 rounded-3xl border border-[#DEDAD2] bg-white p-6 shadow-sm sm:p-8">
            {[1, 2, 3, 4].map((tier) => {
              const tierNodes = skills.filter((s) => s.tier === tier);
              if (tierNodes.length === 0) return null;

              const tierLabels = {
                1: "Foundations & Arrays",
                2: "Pointers & Sliding Window",
                3: "Trees & Recursive Search",
                4: "Dynamic Programming & Optimization"
              };

              return (
                <div key={tier} className="relative">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="rounded-full border border-[#DEDAD2] bg-[#F5F3EE] px-3 py-1 font-mono text-xs font-bold text-[#151515]">
                      TIER 0{tier}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6F6D67]">
                      {tierLabels[tier] || 'Level ' + tier}
                    </span>
                    <div className="h-px flex-1 bg-[#DEDAD2]" />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {tierNodes.map((node) => {
                      const isSelected = selectedSkill?.id === node.id;
                      const isMastered = node.status === "MASTERED";
                      const isAvailable = node.status === "AVAILABLE";

                      let cardStyle = "border-[#DEDAD2]/60 bg-[#F5F3EE]/50 opacity-60 hover:opacity-80";
                      if (isSelected) {
                        cardStyle = "border-[#87965A] bg-[#87965A]/5 shadow-md ring-2 ring-[#87965A]/20";
                      } else if (isMastered) {
                        cardStyle = "border-[#DEDAD2] bg-white hover:border-[#87965A]/60 hover:shadow-sm";
                      } else if (isAvailable) {
                        cardStyle = "border-[#DEDAD2] bg-white hover:border-[#87965A]/50 hover:shadow-sm";
                      }

                      return (
                        <div
                          key={node.id}
                          onClick={() => {
                            sound.playClick();
                            setSelectedSkill(node);
                          }}
                          className={"group cursor-pointer rounded-2xl border p-5 transition-all duration-200 " + cardStyle}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-[#6F6D67]">
                              {node.id}
                            </span>
                            {isMastered ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#87965A]/15 px-2 py-0.5 font-mono text-[11px] font-bold text-[#87965A]">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                <span>MASTERED</span>
                              </span>
                            ) : isAvailable ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#B9AA91]/25 px-2 py-0.5 font-mono text-[11px] font-bold text-[#151515]">
                                <Zap className="h-3.5 w-3.5 fill-[#87965A] text-[#87965A]" />
                                <span>AVAILABLE</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#DEDAD2]/50 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#6F6D67]">
                                <Lock className="h-3 w-3" />
                                <span>LOCKED</span>
                              </span>
                            )}
                          </div>

                          <h3 className="mt-3 text-base font-bold text-[#151515] transition group-hover:text-[#87965A]">
                            {node.name}
                          </h3>
                          <p className="mt-1 text-xs leading-relaxed text-[#6F6D67] line-clamp-2">
                            {node.description}
                          </p>

                          {/* Mastery Meter */}
                          <div className="mt-4">
                            <div className="flex justify-between font-mono text-[11px] text-[#6F6D67]">
                              <span>Concept Mastery</span>
                              <span className={node.masteryScore >= 80 ? "font-bold text-[#87965A]" : "font-semibold text-[#151515]"}>
                                {node.masteryScore}%
                              </span>
                            </div>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#DEDAD2]">
                              <div
                                className="h-full rounded-full bg-[#87965A] transition-all duration-500"
                                style={{ width: node.masteryScore + "%" }}
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

          {/* Selected Node Details Panel */}
          {selectedSkill ? (
            <div className="sticky top-24 space-y-6 rounded-3xl border border-[#DEDAD2] bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-center justify-between border-b border-[#DEDAD2] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6F6D67]">
                  Skill Overview
                </span>
                <span
                  className={
                    "rounded-full px-2.5 py-0.5 font-mono text-xs font-bold " +
                    (selectedSkill.status === "MASTERED"
                      ? "bg-[#87965A]/15 text-[#87965A]"
                      : selectedSkill.status === "AVAILABLE"
                      ? "bg-[#B9AA91]/25 text-[#151515]"
                      : "bg-[#DEDAD2]/50 text-[#6F6D67]")
                  }
                >
                  {selectedSkill.status}
                </span>
              </div>

              <div>
                <span className="font-mono text-xs font-bold text-[#87965A]">
                  {selectedSkill.id}
                </span>
                <h2 className="mt-1 text-2xl font-black text-[#151515]">
                  {selectedSkill.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#6F6D67]">
                  {selectedSkill.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#DEDAD2] bg-[#F5F3EE] p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F6D67]">Tier Level</span>
                  <p className="mt-1 text-lg font-black text-[#151515]">Tier 0{selectedSkill.tier}</p>
                </div>
                <div className="rounded-2xl border border-[#DEDAD2] bg-[#F5F3EE] p-3.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6F6D67]">Mastery Score</span>
                  <p className="mt-1 text-lg font-black text-[#87965A]">{selectedSkill.masteryScore}%</p>
                </div>
              </div>

              {/* Prerequisites */}
              {selectedSkill.prerequisites && selectedSkill.prerequisites.length > 0 && (
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6F6D67]">
                    Prerequisites
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedSkill.prerequisites.map((p) => (
                      <span
                        key={p}
                        className="rounded-lg border border-[#DEDAD2] bg-[#F5F3EE] px-2.5 py-1 font-mono text-xs font-semibold text-[#151515]"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning Guidance */}
              <div className="rounded-2xl border border-[#DEDAD2] bg-[#F5F3EE]/80 p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#151515]">
                  <BookOpen className="h-4 w-4 text-[#87965A]" />
                  <span>How to Advance</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-[#6F6D67]">
                  Solve practice problems covering this topic without hints to increase your concept mastery score.
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <Link
                  href="/world"
                  onClick={() => sound.playClick()}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#151515] py-3.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#2a2a2a] hover:-translate-y-0.5"
                >
                  <span>Start Practice Missions</span>
                  <ArrowRight className="h-4 w-4 text-[#87965A]" />
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
