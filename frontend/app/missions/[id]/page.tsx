"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Send,
  Clock,
  HardDrive,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Terminal,
  Bot,
  Sparkles,
  Check,
  ChevronRight
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { AiMentorCard } from "@/components/ai-mentor-card";
import { VictoryModal } from "@/components/victory-modal";
import { gameApi } from "@/lib/game-api";
import { sound } from "@/lib/sound";
import { auth } from "@/lib/auth";
import type {
  MissionDetail,
  MissionAttemptResult,
  MentorFeedback
} from "@/types/game";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[440px] place-items-center bg-zinc-950 font-mono text-xs text-zinc-500">
      Loading Monaco Code Editor...
    </div>
  )
});

export default function MissionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [mission, setMission] = useState<MissionDetail | null>(null);
  const [code, setCode] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [feedback, setFeedback] = useState<MentorFeedback | null>(null);
  const [result, setResult] = useState<MissionAttemptResult | null>(null);
  const [victory, setVictory] = useState<MissionAttemptResult | null>(null);
  const [busy, setBusy] = useState<"run" | "submit" | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.user()) {
      router.replace("/login");
      return;
    }
    gameApi
      .getMission(id)
      .then((m) => {
        setMission(m);
        setCode(m.starterCode);
      })
      .catch(() => setError("Lesson details could not be loaded."))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleExecute = async (mode: "run" | "submit") => {
    if (!code.trim()) {
      setError("Please write some Java code before running.");
      sound.playError();
      return;
    }

    sound.playClick();
    setBusy(mode);
    setError("");

    try {
      const res = await gameApi.attemptMission(id, code, hintsUsed);
      setResult(res);
      setFeedback(res.aiMentorFeedback);

      if (res.passed) {
        if (mode === "submit") {
          setVictory(res);
        } else {
          sound.playSuccess();
        }
      } else {
        sound.playError();
      }
    } catch {
      setError("Execution error. Check syntax and compiler output.");
      sound.playError();
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <GameNav />
        <main className="grid min-h-[70vh] place-items-center text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <Bot className="h-4 w-4 animate-spin text-indigo-400" />
            <span>Loading lesson environment...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <GameNav />
        <main className="mx-auto max-w-4xl px-6 py-12 text-center text-xs text-zinc-400">
          <p>{error || "Lesson not found."}</p>
          <Link href="/world" className="mt-4 inline-block text-indigo-400 hover:underline">
            Return to Learning Paths
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <GameNav />

      {/* Workspace Sub-Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-950 px-4 py-2.5 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/world"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
              title="Return to Learning Paths"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{mission.title}</span>
                <span className="rounded-md border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-zinc-400">
                  {mission.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <div className="hidden sm:flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-zinc-500" />
                <span>Target: <code className="text-zinc-200">{mission.expectedTimeComplexity || "O(N)"}</code></span>
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="h-3.5 w-3.5 text-zinc-500" />
                <span>Space: <code className="text-zinc-200">{mission.expectedSpaceComplexity || "O(N)"}</code></span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Workspace Layout */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 lg:grid lg:grid-cols-12 lg:gap-6 sm:px-6">
        {/* Left Pane: Problem Context, Ground Truths & AI Coach (5 cols) */}
        <div className="space-y-4 lg:col-span-5 flex flex-col">
          {/* Problem Statement Card */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Problem Context
            </h2>
            <div className="mt-3 space-y-3 text-xs leading-relaxed text-zinc-300">
              <p>{mission.story || mission.objective}</p>
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3">
                <span className="font-semibold text-zinc-200 text-[11px] uppercase tracking-wider block mb-1">
                  Core Objective:
                </span>
                <p className="text-zinc-400">{mission.objective}</p>
              </div>
            </div>

            {/* Test Cases / Examples */}
            {mission.sampleTestCases && mission.sampleTestCases.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-800/80">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-2">
                  Sample Test Cases
                </span>
                <div className="space-y-2">
                  {mission.sampleTestCases.slice(0, 2).map((tc, idx) => (
                    <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 font-mono text-[11px] text-zinc-300">
                      <div><span className="text-zinc-500">Input: </span>{tc.input}</div>
                      <div><span className="text-zinc-500">Expected: </span><span className="text-emerald-400">{tc.expectedOutput}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* AI Diagnosis & Mentor Coach Card */}
          <section className="flex-1">
            <AiMentorCard
              feedback={feedback}
              missionId={id}
              totalHintsAvailable={mission.totalHintsAvailable || 3}
              hintsUsed={hintsUsed}
              onHintRevealed={(h, tier) => setHintsUsed(tier)}
            />
          </section>
        </div>

        {/* Right Pane: Code Editor & Execution Output (7 cols) */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          {/* Monaco Editor Container */}
          <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-sm">
            {/* Editor Action Bar */}
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="font-mono text-zinc-300 font-semibold">Solution.java</span>
                <span className="text-zinc-500 text-[11px]">· JDK 21 Sandbox</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(mission.starterCode)}
                  className="rounded-lg px-2.5 py-1 text-[11px] text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                  title="Reset to starter code template"
                >
                  Reset
                </button>

                <button
                  onClick={() => handleExecute("run")}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 transition hover:border-zinc-600 hover:bg-zinc-700 disabled:opacity-50"
                >
                  <Play className="h-3 w-3 text-indigo-400" />
                  <span>{busy === "run" ? "Running..." : "Run Tests"}</span>
                </button>

                <button
                  onClick={() => handleExecute("submit")}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1 text-xs font-medium text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-500 disabled:opacity-50"
                >
                  <Send className="h-3 w-3" />
                  <span>{busy === "submit" ? "Analyzing..." : "Submit & Analyze"}</span>
                </button>
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="flex-1 min-h-[380px]">
              <Editor
                height="100%"
                language="java"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v || "")}
                options={{
                  fontSize: 13,
                  lineNumbers: "on",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4
                }}
              />
            </div>
          </section>

          {/* Execution Telemetry / Terminal Drawer */}
          {result && (
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="font-semibold text-zinc-300">Execution Telemetry</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={result.passed ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                    {result.passed ? "✓ ALL TESTS PASSED" : "✗ TEST SUITE FAILED"}
                  </span>
                  {result.executionTime !== undefined && (
                    <span className="text-zinc-500">{result.executionTime}ms</span>
                  )}
                </div>
              </div>

              {/* Stdout Output */}
              {result.output && (
                <div className="mb-2">
                  <span className="text-zinc-500 text-[11px] block">Standard Output:</span>
                  <pre className="mt-1 rounded-lg bg-zinc-900/60 p-2 text-zinc-300 whitespace-pre-wrap">
                    {result.output}
                  </pre>
                </div>
              )}

              {/* Test Cases Results */}
              {result.testCaseResults && result.testCaseResults.length > 0 && (
                <div className="space-y-1.5">
                  {result.testCaseResults.map((tc, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between rounded-lg p-2 text-[11px] ${
                        tc.passed ? "bg-emerald-950/20 text-emerald-300 border border-emerald-500/20" : "bg-rose-950/20 text-rose-300 border border-rose-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tc.passed ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-rose-400" />}
                        <span>Case {tc.number || idx + 1}: {tc.status}</span>
                      </div>
                      <div>
                        {tc.passed ? (
                          <span className="text-emerald-400 font-semibold">Passed</span>
                        ) : (
                          <span>Output: <code className="text-rose-300">{tc.output}</code></span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </main>

      {/* Victory Celebration Modal */}
      {victory && (
        <VictoryModal
          result={victory}
          onClose={() => setVictory(null)}
          onNextMission={() => router.push("/world")}
        />
      )}
    </div>
  );
}
