"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Play, Send, CheckCircle2, XCircle, Terminal, AlertCircle } from "lucide-react";
import { GameNav } from "@/components/game-nav";
import api, { apiError } from "@/lib/api";
import type { ExecutionResult, ProblemDetail, Submission } from "@/types/problems";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <div className="grid h-[380px] place-items-center bg-zinc-950 text-xs text-zinc-500">Loading code editor...</div>
});

export default function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [code, setCode] = useState("");
  const [history, setHistory] = useState<Submission[]>([]);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<"run" | "submit" | null>(null);

  useEffect(() => {
    api
      .get<ProblemDetail>(`/api/problems/${id}`)
      .then((r) => {
        setProblem(r.data);
        setCode(r.data.starterCode);
      })
      .catch((e) => setError(apiError(e)));

    api
      .get<Submission[]>(`/api/submissions/my?problemId=${id}`)
      .then((r) => setHistory(r.data))
      .catch(() => {});
  }, [id]);

  const execute = async (kind: "run" | "submit") => {
    if (!code.trim()) return setError("Please write some Java code before submitting.");
    setBusy(kind);
    setError("");
    setResult(null);

    try {
      if (kind === "run") {
        const { data } = await api.post<ExecutionResult>("/api/submissions/run", {
          problemId: id,
          language: "java",
          code
        });
        setResult(data);
      } else {
        const { data } = await api.post<Submission>("/api/submissions", {
          problemId: id,
          language: "java",
          code
        });
        setHistory((prev) => [data, ...prev]);
        setResult({
          status: data.status,
          testCasesPassed: data.testCasesPassed,
          totalTestCases: data.totalTestCases,
          executionTime: data.executionTime,
          memory: data.memory,
          output: `Status: ${data.status} · ${data.testCasesPassed}/${data.totalTestCases} test cases passed.`,
          testCases: []
        });
      }
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy(null);
    }
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <GameNav />
        <main className="p-8 text-center text-xs text-zinc-400">Loading problem...</main>
      </div>
    );
  }

  const diffBadge =
    problem.difficulty === "EASY"
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      : problem.difficulty === "MEDIUM"
      ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
      : "text-rose-400 bg-rose-500/10 border-rose-500/30";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <GameNav />

      {/* Sub-Header */}
      <div className="border-b border-zinc-800/80 bg-zinc-950 px-4 py-2.5 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/problems"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{problem.title}</span>
              <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${diffBadge}`}>
                {problem.difficulty}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 p-4 lg:grid lg:grid-cols-12 lg:gap-6 sm:px-6">
        {/* Left: Statement & History (5 cols) */}
        <div className="space-y-4 lg:col-span-5 flex flex-col">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 backdrop-blur-md">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Description</h2>
            <div className="mt-3 text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
              {problem.description}
            </div>

            {problem.constraints && problem.constraints.length > 0 && (
              <div className="mt-4 pt-3 border-t border-zinc-800">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Constraints
                </span>
                <ul className="list-disc pl-4 space-y-1 text-xs text-zinc-400">
                  {problem.constraints.map((c, idx) => (
                    <li key={idx}><code className="text-zinc-300 font-mono">{c}</code></li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Submissions History */}
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">Submission History</h3>
            {history.length === 0 ? (
              <p className="text-xs text-zinc-500">No submissions recorded for this problem yet.</p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 4).map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950/60 p-2.5 text-xs">
                    <span className={sub.status === "ACCEPTED" ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"}>
                      {sub.status}
                    </span>
                    <span className="text-[11px] text-zinc-500">{new Date(sub.createdAt).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right: Monaco Editor & Telemetry (7 cols) */}
        <div className="flex flex-col gap-4 lg:col-span-7">
          <section className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs">
              <span className="font-mono text-zinc-300 font-semibold text-xs">Solution.java</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCode(problem.starterCode)}
                  className="rounded-lg px-2.5 py-1 text-[11px] text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                >
                  Reset
                </button>
                <button
                  onClick={() => execute("run")}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700 disabled:opacity-50"
                >
                  <Play className="h-3 w-3 text-indigo-400" />
                  <span>{busy === "run" ? "Running..." : "Run"}</span>
                </button>
                <button
                  onClick={() => execute("submit")}
                  disabled={busy !== null}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1 text-xs font-medium text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
                >
                  <Send className="h-3 w-3" />
                  <span>{busy === "submit" ? "Evaluating..." : "Submit"}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 min-h-[360px]">
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
                  automaticLayout: true
                }}
              />
            </div>
          </section>

          {/* Results Output */}
          {result && (
            <section className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-zinc-400" />
                  <span className="font-semibold text-zinc-300">Execution Output</span>
                </div>
                <span className={result.status === "ACCEPTED" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                  {result.status === "ACCEPTED" ? "✓ ACCEPTED" : `✗ ${result.status || "FAILED"}`}
                </span>
              </div>

              {result.output && (
                <pre className="rounded-lg bg-zinc-900/60 p-2 text-zinc-300 whitespace-pre-wrap">
                  {result.output}
                </pre>
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
    </div>
  );
}
