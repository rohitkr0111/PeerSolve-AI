"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Send,
  Zap,
  Clock,
  HardDrive,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BookOpen,
  Terminal,
} from "lucide-react";
import { GameNav } from "@/components/game-nav";
import { Loading } from "@/components/loading";
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
    <Loading compact className="h-[440px] bg-slate-950" message="BOOTING QUANTUM MONACO BUFFER..." />
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
      .catch(() => setError("Mission coordinates not found."))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleExecute = async (mode: "run" | "submit") => {
    if (!code.trim()) {
      setError("Source buffer empty. Write Java code before deploying.");
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
      setError("Execution pipeline failure. Verify compiler logic or retry.");
      sound.playError();
    } finally {
      setBusy(null);
    }
  };

  const handleHintRevealed = (_hint: string, tier: number) => {
    setHintsUsed(tier);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <GameNav />
        <main>
          <Loading message="DOWNLOADING MISSION BRIEFING..." />
        </main>
      </div>
    );
  }

  if (error && !mission) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <GameNav />
        <main className="mx-auto max-w-lg px-6 py-20 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-rose-400" />
          <h2 className="mt-4 text-xl font-bold">Mission Offline</h2>
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

      {victory && <VictoryModal result={victory} onClose={() => setVictory(null)} />}

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/world"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2 font-mono text-xs text-slate-400 transition hover:text-cyan-400"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>RETURN TO SECTOR MAP</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">SECTOR OBJECTIVE</span>
            <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 font-mono text-xs font-bold text-cyan-300 uppercase">
              NODE 0{mission?.order} // {mission?.difficulty}
            </span>
          </div>
        </div>

        {/* 2-Column Tactical Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.35fr]">
          {/* Left Column: Briefing + AI Mentor */}
          <div className="space-y-6">
            {/* Mission Story & Objective Card */}
            <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-100 sm:text-3xl">
                    {mission?.title}
                  </h1>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">
                    {mission?.story}
                  </p>
                </div>
              </div>

              {/* Tactical Objective */}
              <div className="mt-5 rounded-xl border border-cyan-500/20 bg-slate-950/60 p-4">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  TACTICAL OBJECTIVE
                </span>
                <p className="mt-1 text-xs leading-relaxed text-slate-200">
                  {mission?.objective}
                </p>
              </div>

              {/* Complexity Target HUD */}
              <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <div>
                    <span className="block text-[10px] text-slate-500">MAX TIME</span>
                    <span className="font-bold text-slate-200">{mission?.expectedTimeComplexity}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 p-2.5">
                  <HardDrive className="h-4 w-4 text-indigo-400" />
                  <div>
                    <span className="block text-[10px] text-slate-500">MAX SPACE</span>
                    <span className="font-bold text-slate-200">{mission?.expectedSpaceComplexity}</span>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div className="mt-6 space-y-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
                  Telemetry Ground Truths
                </span>
                {mission?.examples.map((ex, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3.5 font-mono text-xs">
                    <div className="text-slate-400">
                      <span className="text-slate-500">IN: </span>
                      <span className="text-slate-200">{ex.input}</span>
                    </div>
                    <div className="mt-1 text-slate-400">
                      <span className="text-slate-500">OUT: </span>
                      <span className="text-emerald-300">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <p className="mt-1.5 text-[11px] text-slate-500 font-sans">{ex.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Constraints */}
              {mission?.constraints && mission.constraints.length > 0 && (
                <div className="mt-5">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    CONSTRAINTS
                  </span>
                  <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-slate-400">
                    {mission.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </article>

            {/* AI Mentor NPC */}
            <AiMentorCard
              feedback={feedback}
              missionId={id}
              totalHintsAvailable={mission?.totalHintsAvailable || 3}
              onHintRevealed={handleHintRevealed}
              hintsUsed={hintsUsed}
            />
          </div>

          {/* Right Column: Code Editor + Telemetry Panel */}
          <div className="space-y-4">
            {/* Monaco Editor Terminal Container */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl">
              {/* Header Tab */}
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 text-xs">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono font-bold text-slate-200">Main.java</span>
                  <span className="text-slate-500">• Java 21 Sandbox</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500">MONACO ACTIVE</span>
              </div>

              {/* Editor */}
              <Editor
                height="450px"
                theme="vs-dark"
                defaultLanguage="java"
                value={code}
                onChange={(val) => setCode(val ?? "")}
                options={{
                  fontSize: 13,
                  lineNumbers: "on",
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 4,
                  padding: { top: 12, bottom: 12 }
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <button
                  disabled={!!busy}
                  onClick={() => handleExecute("run")}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-2.5 font-mono text-xs font-bold text-slate-200 shadow-sm transition hover:border-slate-500 hover:bg-slate-800 disabled:opacity-50"
                >
                  <Play className="h-3.5 w-3.5 fill-current text-cyan-400" />
                  <span>{busy === "run" ? "RUNNING..." : "RUN DIAGNOSTICS"}</span>
                </button>

                <button
                  disabled={!!busy}
                  onClick={() => handleExecute("submit")}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-6 py-2.5 font-mono text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:opacity-90 disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{busy === "submit" ? "SUBMITTING..." : "SUBMIT TELEMETRY"}</span>
                </button>
              </div>

              <span className="font-mono text-xs text-slate-500">
                Reward: <span className="font-bold text-cyan-400">+{mission?.xpReward} XP</span>
              </span>
            </div>

            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 text-xs text-rose-300">
                {error}
              </div>
            )}

            {/* Test Case Execution Telemetry Results */}
            {result && (
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    ) : (
                      <XCircle className="h-5 w-5 text-rose-400" />
                    )}
                    <span className={`font-mono text-sm font-bold ${result.passed ? "text-emerald-300" : "text-rose-300"}`}>
                      {result.status}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-slate-400">
                    {result.testCasesPassed} / {result.totalTestCases} Tests Passed • {result.executionTime}ms
                  </span>
                </div>

                {/* Individual Test Cases */}
                <div className="mt-3 space-y-2">
                  {result.testCaseResults.map((tc) => (
                    <div
                      key={tc.number}
                      className={`flex items-center justify-between rounded-lg border p-3 font-mono text-xs ${
                        tc.passed
                          ? "border-emerald-500/20 bg-emerald-950/10 text-emerald-200"
                          : "border-rose-500/20 bg-rose-950/10 text-rose-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tc.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-400" />
                        )}
                        <span>Test Case #{tc.number}</span>
                      </div>
                      <span className="text-[11px] opacity-80">{tc.status}</span>
                    </div>
                  ))}
                </div>

                {/* Terminal Standard Output / Error Stream */}
                {result.output && (
                  <div className="mt-4">
                    <span className="font-mono text-[10px] uppercase text-slate-500">Output Stream</span>
                    <pre className="mt-1 max-h-36 overflow-auto rounded-lg bg-slate-950 p-3 font-mono text-xs text-slate-300">
                      {result.output}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
