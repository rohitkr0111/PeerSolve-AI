"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Skull,
  Bot,
  Flame,
  Zap,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Award,
  AlertTriangle,
  Send,
  MessageSquare,
  Shield,
  HelpCircle,
  Play
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { gameApi } from "@/lib/game-api";
import { sound } from "@/lib/sound";
import { auth } from "@/lib/auth";
import type { BossBattle, BossStage, BossStageResult } from "@/types/game";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[340px] place-items-center bg-slate-950 font-mono text-xs text-slate-500">
      BOOTING QUANTUM MONACO BUFFER...
    </div>
  )
});

export default function BossBattlePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [boss, setBoss] = useState<BossBattle | null>(null);
  const [currentStageNum, setCurrentStageNum] = useState(1);
  const [bossHealth, setBossHealth] = useState(100);
  const [bossDialogue, setBossDialogue] = useState("");
  const [mentorFeedback, setMentorFeedback] = useState("");

  // Stage form states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [defeated, setDefeated] = useState(false);
  const [victoryResult, setVictoryResult] = useState<BossStageResult | null>(null);

  useEffect(() => {
    if (!auth.user()) {
      router.replace("/login");
      return;
    }
    gameApi
      .getBossBattle(id)
      .then((b) => {
        setBoss(b);
        setBossDialogue(b.stages[0]?.dialogue || "You dare challenge my loops?!");
        setCode(b.stages[1]?.starterCode || "");
      })
      .catch(() => setError("Boss coordinates failed to lock."));
  }, [id, router]);

  const activeStage: BossStage | undefined = boss?.stages[currentStageNum - 1];

  const submitStage = async () => {
    if (!activeStage) return;
    sound.playClick();
    setBusy(true);
    setError("");

    try {
      let payload: { selectedOptionIndex?: number; code?: string; explanation?: string } = {};

      if (activeStage.stageType === "DIAGNOSE") {
        if (selectedOption === null) {
          setError("Select an option before submitting diagnosis.");
          setBusy(false);
          return;
        }
        payload = { selectedOptionIndex: selectedOption };
      } else if (activeStage.stageType === "FIX" || activeStage.stageType === "OPTIMIZE") {
        if (!code.trim()) {
          setError("Code cannot be empty.");
          setBusy(false);
          return;
        }
        payload = { code };
      } else if (activeStage.stageType === "EXPLAIN") {
        if (!explanation.trim()) {
          setError("Provide an explanation of the algorithmic trade-offs.");
          setBusy(false);
          return;
        }
        payload = { explanation };
      }

      const res = await gameApi.attemptBossStage(id, currentStageNum, payload);

      if (res.passed) {
        sound.playBossHit();
        setBossHealth(res.bossHealthPercent);
        setBossDialogue(res.bossDialogue);
        setMentorFeedback(res.mentorFeedback);

        if (res.bossDefeated) {
          setDefeated(true);
          setVictoryResult(res);
          sound.playLevelUp();
          try {
            confetti({ particleCount: 120, spread: 90 });
          } catch {}
        } else {
          // Advance to next stage
          const nextStageNum = currentStageNum + 1;
          setCurrentStageNum(nextStageNum);
          const nextStage = boss?.stages[nextStageNum - 1];
          if (nextStage?.starterCode) {
            setCode(nextStage.starterCode);
          }
        }
      } else {
        sound.playError();
        setBossDialogue(res.bossDialogue);
        setMentorFeedback(res.mentorFeedback);
      }
    } catch {
      setError("Subroutine attempt crashed. Review your input and try again.");
      sound.playError();
    } finally {
      setBusy(false);
    }
  };

  if (error && !boss) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <GameNav />
        <main className="mx-auto max-w-lg px-6 py-20 text-center">
          <Skull className="mx-auto h-12 w-12 text-rose-400" />
          <h2 className="mt-4 text-xl font-bold">Boss Arena Offline</h2>
          <p className="mt-2 text-sm text-slate-400">{error}</p>
          <Link href="/world" className="mt-6 inline-block rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold">
            Return to Sector Map
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <GameNav />

      {/* Epic Victory Modal */}
      {defeated && victoryResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-rose-500/50 bg-gradient-to-b from-slate-900 to-slate-950 p-8 text-center shadow-2xl shadow-rose-950/50">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-rose-500/50 bg-rose-950/40 shadow-lg shadow-rose-500/30 animate-pulse">
              <Skull className="h-10 w-10 text-rose-400" />
            </div>

            <span className="mt-6 inline-block rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-xs font-bold text-rose-300">
              SECTOR GUARDIAN DEFEATED
            </span>
            <h2 className="mt-2 text-3xl font-black text-slate-100">
              {boss?.bossName} Obliterated!
            </h2>
            <p className="mt-2 text-xs text-slate-300">
              You dismantled all 4 quadratic subroutines and proved your algorithmic dominance.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="font-mono text-xs text-slate-400">XP REWARD</span>
                <p className="font-mono text-xl font-bold text-cyan-400">+{victoryResult.xpEarned} XP</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                <span className="font-mono text-xs text-slate-400">SKILL UNLOCKED</span>
                <p className="font-mono text-sm font-bold text-emerald-400">
                  {victoryResult.unlockedSkillId ?? "TWO_POINTERS"}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-left">
              <div className="flex items-center gap-2 text-amber-300">
                <Award className="h-4 w-4" />
                <span className="font-mono text-xs font-bold">Achievement: BOSS SLAYER</span>
              </div>
              <p className="mt-1 text-xs text-slate-300">
                Granted for defeating an algorithmic boss battle without crashing.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                href="/skill-tree"
                onClick={() => sound.playClick()}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-3 font-bold text-slate-950 shadow-lg transition hover:opacity-90"
              >
                <span>View Skill Tree</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/world"
                onClick={() => sound.playClick()}
                className="rounded-xl border border-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
              >
                World Map
              </Link>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Boss Arena HUD Banner */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-rose-500/40 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 p-6 shadow-2xl shadow-rose-950/30">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            {/* Boss Identity */}
            <div className="flex items-start gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-rose-500/50 bg-rose-950/60 shadow-lg shadow-rose-500/20">
                <Flame className="h-8 w-8 text-rose-400 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-rose-300 uppercase">
                    SECTOR BOSS // MULTI-STAGE
                  </span>
                  <span className="font-mono text-xs text-slate-400">
                    STAGE {currentStageNum} OF 4
                  </span>
                </div>
                <h1 className="mt-1 text-2xl font-black text-slate-100 sm:text-3xl">
                  {boss?.title}
                </h1>
                <p className="font-medium text-xs text-rose-300/80">{boss?.subtitle}</p>
              </div>
            </div>

            {/* Boss Health Bar */}
            <div className="flex flex-col gap-1.5 md:min-w-[280px]">
              <div className="flex items-center justify-between font-mono text-xs font-bold">
                <span className="text-rose-400">BOSS INTEGRITY</span>
                <span className="text-slate-300">{bossHealth}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 p-0.5 border border-rose-900/50">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 to-amber-500 transition-all duration-700"
                  style={{ width: `${bossHealth}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentStageNum === 1
                  ? "Stage 1: Diagnose Bug"
                  : currentStageNum === 2
                  ? "Stage 2: Fix Implementation"
                  : currentStageNum === 3
                  ? "Stage 3: Optimize Complexity"
                  : "Stage 4: Conceptual Defense"}
              </span>
            </div>
          </div>

          {/* Boss Taunt / Dialogue Bubble */}
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-950/30 p-4">
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
            <div>
              <span className="font-mono text-[11px] font-bold text-rose-300">
                {boss?.bossName}:
              </span>
              <p className="mt-0.5 text-xs font-mono text-rose-200">
                &ldquo;{bossDialogue}&rdquo;
              </p>
            </div>
          </div>
        </section>

        {/* Tactical Stage Workspace */}
        {activeStage && (
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            {/* Left Column: Stage Instructions & ADA-7 Mentorship */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-mono text-xs font-bold text-cyan-400 uppercase">
                    TACTICAL OBJECTIVE // {activeStage.stageType}
                  </span>
                  <span className="font-mono text-xs text-amber-400">
                    +{activeStage.stageXp} XP
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-100">
                  {activeStage.title}
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-slate-300">
                  {activeStage.instructions}
                </p>

                {activeStage.mentorHint && (
                  <div className="mt-4 flex items-start gap-2 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3 text-xs text-cyan-200">
                    <Bot className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                    <div>
                      <span className="font-bold">ADA-7 Analysis: </span>
                      {activeStage.mentorHint}
                    </div>
                  </div>
                )}
              </div>

              {/* Mentor Feedback after attempt */}
              {mentorFeedback && (
                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200">
                  <div className="flex items-center gap-2 font-bold text-amber-300">
                    <Bot className="h-4 w-4" />
                    <span>ADA-7 Telemetry Report:</span>
                  </div>
                  <p className="mt-1.5 leading-relaxed">{mentorFeedback}</p>
                </div>
              )}
            </div>

            {/* Right Column: Stage Interactive Puzzle */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
              {/* STAGE 1: DIAGNOSE */}
              {activeStage.stageType === "DIAGNOSE" && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <span className="font-mono text-[10px] uppercase text-slate-500">
                      Vulnerable Subroutine Snippet
                    </span>
                    <pre className="mt-2 overflow-auto font-mono text-xs text-amber-300">
                      {activeStage.buggyCode}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-xs font-bold uppercase text-slate-400">
                      Isolate the Fatal Bug:
                    </span>
                    {activeStage.diagnoseOptions?.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          sound.playClick();
                          setSelectedOption(idx);
                        }}
                        className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-xs transition-all ${
                          selectedOption === idx
                            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200 shadow-md"
                            : "border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-700 font-mono text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STAGE 2 & 3: FIX / OPTIMIZE CODE */}
              {(activeStage.stageType === "FIX" || activeStage.stageType === "OPTIMIZE") && (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
                    <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2 font-mono text-xs text-slate-400">
                      <span>Main.java</span>
                      <span>{activeStage.stageType} PROTOCOL</span>
                    </div>
                    <Editor
                      height="380px"
                      theme="vs-dark"
                      defaultLanguage="java"
                      value={code}
                      onChange={(val) => setCode(val ?? "")}
                      options={{
                        fontSize: 13,
                        lineNumbers: "on",
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                </div>
              )}

              {/* STAGE 4: EXPLAIN */}
              {activeStage.stageType === "EXPLAIN" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/10 p-3 text-xs text-cyan-200">
                    <p className="font-semibold">ADA-7 Oral Defense Evaluation:</p>
                    <p className="mt-1 text-slate-400">
                      Explain in 2-4 sentences how trading auxiliary space (such as a HashMap) achieves O(N) linear time complexity over O(N²) quadratic nested scanning.
                    </p>
                  </div>

                  <textarea
                    rows={6}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="Enter your technical explanation here (e.g. Discuss time complexity, space overhead, constant lookup speed, nested iteration vs single pass)..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 outline-none focus:border-cyan-400"
                  />
                </div>
              )}

              {error && (
                <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
                  {error}
                </p>
              )}

              <button
                disabled={busy}
                onClick={submitStage}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 py-3.5 font-mono text-xs font-bold text-slate-950 shadow-xl shadow-rose-500/20 transition hover:opacity-90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{busy ? "TRANSMITTING TACTICAL STRIKE..." : "ENGAGE BOSS SUBROUTINE"}</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
