"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  Target,
  Bot,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  MessageSquare,
  HelpCircle,
  Play,
  Sparkles,
  Check,
  ChevronRight,
  BrainCircuit
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { gameApi } from "@/lib/game-api";
import { sound } from "@/lib/sound";
import { auth } from "@/lib/auth";
import type { BossBattle, BossStage, BossStageResult } from "@/types/game";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[340px] place-items-center bg-zinc-950 font-mono text-xs text-zinc-500">
      Loading Code Editor...
    </div>
  )
});

export default function MasteryChallengePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [boss, setBoss] = useState<BossBattle | null>(null);
  const [currentStageNum, setCurrentStageNum] = useState(1);
  const [progressPct, setProgressPct] = useState(0);

  // Stage form states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [code, setCode] = useState("");
  const [explanation, setExplanation] = useState("");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [certified, setCertified] = useState(false);
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
        setCode(b.stages[1]?.starterCode || "");
      })
      .catch(() => setError("Mastery challenge could not be loaded."));
  }, [id, router]);

  const activeStage: BossStage | undefined = boss?.stages[currentStageNum - 1];

  const submitStage = async () => {
    if (!activeStage) return;
    sound.playClick();
    setBusy(true);
    setError("");
    setFeedback(null);

    try {
      let payload: { selectedOptionIndex?: number; code?: string; explanation?: string } = {};

      if (activeStage.stageType === "DIAGNOSE") {
        if (selectedOption === null) {
          setError("Please select an option before submitting diagnosis.");
          setBusy(false);
          return;
        }
        payload = { selectedOptionIndex: selectedOption };
      } else if (activeStage.stageType === "FIX" || activeStage.stageType === "OPTIMIZE") {
        if (!code.trim()) {
          setError("Code solution cannot be empty.");
          setBusy(false);
          return;
        }
        payload = { code };
      } else if (activeStage.stageType === "EXPLAIN") {
        if (!explanation.trim()) {
          setError("Please provide your architectural explanation.");
          setBusy(false);
          return;
        }
        payload = { explanation };
      }

      const res = await gameApi.attemptBossStage(id, currentStageNum, payload);

      if (res.passed) {
        sound.playBossHit();
        setFeedback(res.mentorFeedback || "Stage verified successfully.");
        setProgressPct(Math.min(currentStageNum * 25, 100));

        if (res.bossDefeated || currentStageNum >= (boss?.stages.length || 4)) {
          setCertified(true);
          setVictoryResult(res);
          sound.playLevelUp();
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } else {
          // Advance to next stage
          const nextStageNum = currentStageNum + 1;
          setCurrentStageNum(nextStageNum);
          setSelectedOption(null);
          setExplanation("");
          if (boss?.stages[nextStageNum - 1]?.starterCode) {
            setCode(boss.stages[nextStageNum - 1].starterCode || "");
          }
        }
      } else {
        sound.playError();
        setError(res.mentorFeedback || "Verification failed. Review your approach and try again.");
      }
    } catch {
      setError("An evaluation error occurred. Please check your submission.");
      sound.playError();
    } finally {
      setBusy(false);
    }
  };

  const getCleanChallengeTitle = (name?: string) => {
    if (!name) return "Mastery Challenge";
    if (name.includes("Chrono") || name.includes("Array")) return "Mastery Challenge — Arrays & Hashing";
    if (name.includes("Buffer") || name.includes("Pointer")) return "Mastery Challenge — Two Pointers";
    if (name.includes("Colossus") || name.includes("Sanctum")) return "Mastery Challenge — Hash Tables";
    return `Mastery Challenge — ${name}`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <GameNav />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Breadcrumb Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/world"
            className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200"
          >
            &larr; Back to Learning Paths
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400">Mastery Progress:</span>
            <span className="font-mono text-xs font-bold text-indigo-400">
              Stage {currentStageNum} of {boss?.stages.length || 4}
            </span>
          </div>
        </div>

        {/* Milestone Card */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 backdrop-blur-md">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-zinc-800 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-xs font-bold text-indigo-300 uppercase">
                  VERIFICATION MILESTONE
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  TOPIC CERTIFICATION
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {getCleanChallengeTitle(boss?.title || boss?.bossName)}
              </h1>
              <p className="mt-1 text-xs text-zinc-400">
                Four rigorous evaluation stages: Diagnose &rarr; Fix &rarr; Optimize &rarr; Explain.
              </p>
            </div>

            {/* 4 Stage Pills */}
            <div className="flex items-center gap-1.5">
              {["1. Diagnose", "2. Fix", "3. Optimize", "4. Explain"].map((lbl, idx) => {
                const stageNum = idx + 1;
                const isPassed = stageNum < currentStageNum || certified;
                const isCurrent = stageNum === currentStageNum && !certified;
                return (
                  <div
                    key={idx}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                      isPassed
                        ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30"
                        : isCurrent
                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                        : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                    }`}
                  >
                    {isPassed ? "✓ " : ""}{lbl}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Stage Container */}
          {!certified && activeStage ? (
            <div className="mt-6 space-y-6">
              {/* Stage Header */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400 uppercase">
                    Stage {activeStage.stageNumber} · {activeStage.stageType}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-semibold text-white">
                  {activeStage.title || activeStage.instructions || "Analyze and solve this stage."}
                </h3>
              </div>

              {/* Stage 1: DIAGNOSE */}
              {activeStage.stageType === "DIAGNOSE" && (
                <div className="space-y-4">
                  {(activeStage.buggyCode || activeStage.starterCode) && (
                    <div>
                      <span className="text-[11px] font-mono text-zinc-400 block mb-1.5">
                        Inspect This Implementation:
                      </span>
                      <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-300 overflow-x-auto">
                        {activeStage.buggyCode || activeStage.starterCode}
                      </pre>
                    </div>
                  )}

                  {activeStage.diagnoseOptions && (
                    <div className="space-y-2">
                      <span className="text-xs font-medium text-zinc-300 block">
                        Select the primary vulnerability or flaw:
                      </span>
                      {activeStage.diagnoseOptions.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            sound.playClick();
                            setSelectedOption(idx);
                          }}
                          className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left text-xs transition ${
                            selectedOption === idx
                              ? "border-indigo-500 bg-indigo-950/30 text-white"
                              : "border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                          }`}
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-950 text-[10px] font-mono font-bold">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{option}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Stage 2 & 3: FIX / OPTIMIZE */}
              {(activeStage.stageType === "FIX" || activeStage.stageType === "OPTIMIZE") && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Write your Java implementation below:</span>
                    <span className="font-mono text-indigo-400">Java 21 · Verified by JUnit &amp; AST</span>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-zinc-800">
                    <Editor
                      height="320px"
                      language="java"
                      theme="vs-dark"
                      value={code}
                      onChange={(v) => setCode(v || "")}
                      options={{
                        fontSize: 13,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Stage 4: EXPLAIN */}
              {activeStage.stageType === "EXPLAIN" && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <MessageSquare className="h-4 w-4 text-indigo-400" />
                    <span>Explain your algorithmic design, space-time trade-offs, and why this approach is optimal:</span>
                  </div>
                  <textarea
                    rows={5}
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    placeholder="E.g., By storing visited elements in a HashSet, lookup complexity reduces from O(N) to O(1) average time, yielding an overall O(N) single-pass runtime with O(N) auxiliary space..."
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}

              {/* Feedback and Error Alerts */}
              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
                  <XCircle className="h-4 w-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              {feedback && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{feedback}</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={submitStage}
                  disabled={busy}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{busy ? "Evaluating..." : `Submit Stage ${activeStage.stageNumber}`}</span>
                </button>
              </div>
            </div>
          ) : (
            /* Certified State */
            <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/20 text-emerald-300">
                <Check className="h-7 w-7" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-white">
                Topic Competence Certified!
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs text-zinc-300 leading-relaxed">
                You have successfully completed all 4 stages: Diagnose, Fix, Optimize, and Explain. Your verified progress has been updated in your profile.
              </p>

              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/world"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
                >
                  Next Learning Track &rarr;
                </Link>
                <Link
                  href="/dashboard"
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-xs font-semibold text-zinc-200 transition hover:bg-zinc-700"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
