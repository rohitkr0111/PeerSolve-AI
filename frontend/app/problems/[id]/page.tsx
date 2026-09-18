"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Send,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Sparkles,
  Clock,
  ArrowRight,
  Code2
} from "lucide-react";
import api, { apiError } from "@/lib/api";
import { Badge, format } from "@/components/problem-ui";
import { Loading } from "@/components/loading";
import type { ExecutionResult, ProblemDetail, Submission } from "@/types/problems";

const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <Loading compact className="h-[380px] bg-zinc-950 text-zinc-400" message="Loading editor…" />
  )
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
    if (!code.trim()) return setError("Write some Java code before running it.");
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
        setResult({
          status: data.status,
          testCasesPassed: data.testCasesPassed,
          totalTestCases: data.totalTestCases,
          executionTime: data.executionTime,
          memory: data.memory,
          output: "",
          testCases: []
        });
        setHistory((h) => [data, ...h]);
      }
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy(null);
    }
  };

  if (error && !problem) return <PageMessage message={error} />;
  if (!problem) return <Loading className="min-h-screen text-zinc-400" message="Loading problem…" />;

  return (
    <main className="min-h-screen px-5 py-6 lg:px-8 bg-zinc-950 text-zinc-100">
      <header className="mx-auto flex max-w-7xl items-center justify-between">
        <Link href="/problems" className="text-xl font-bold">
          Peer<span className="text-indigo-400">Solve</span>
        </Link>
        <Link href="/problems" className="btn-secondary inline-flex items-center gap-1.5 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Problems</span>
        </Link>
      </header>

      <div className="mx-auto mt-6 grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        {/* Problem Description Column */}
        <article className="card max-h-[calc(100vh-8rem)] overflow-y-auto p-6">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
            <Badge value={problem.difficulty} />
          </div>
          <p className="mt-2 text-xs text-indigo-400 font-medium">
            {problem.topics.map(format).join(" • ")}
          </p>

          <h2 className="mt-6 text-sm font-bold uppercase tracking-wider text-zinc-400">Description</h2>
          <p className="mt-2 leading-relaxed text-sm text-zinc-300">{problem.description}</p>

          <h2 className="mt-6 text-sm font-bold uppercase tracking-wider text-zinc-400">Examples</h2>
          {problem.examples.map((e, i) => (
            <div key={i} className="mt-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 p-3.5 font-mono text-xs">
              <p>
                <span className="text-zinc-500">Input: </span>
                <span className="text-zinc-200">{e.input}</span>
              </p>
              <p className="mt-1.5">
                <span className="text-zinc-500">Output: </span>
                <span className="text-zinc-200">{e.output}</span>
              </p>
            </div>
          ))}

          <h2 className="mt-6 text-sm font-bold uppercase tracking-wider text-zinc-400">Constraints</h2>
          <ul className="mt-2 list-inside list-disc text-xs text-zinc-400 space-y-1">
            {problem.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <div className="mt-6 grid gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-3.5 text-xs sm:grid-cols-2">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Expected Time</span>
              <span className="font-mono text-zinc-200">{problem.expectedTimeComplexity}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Expected Space</span>
              <span className="font-mono text-zinc-200">{problem.expectedSpaceComplexity}</span>
            </div>
          </div>

          <Link
            href="/world"
            className="btn-primary mt-6 inline-flex items-center gap-2 text-xs"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Learning Track</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </article>

        {/* Code Workspace Column */}
        <section className="space-y-4">
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2.5 text-xs font-semibold">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>Java 21</span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">Main.java</span>
            </div>
            <Editor
              height="400px"
              theme="vs-dark"
              defaultLanguage="java"
              value={code}
              onChange={(v) => setCode(v ?? "")}
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                padding: { top: 14 }
              }}
            />
          </div>

          <div className="flex gap-2.5">
            <button
              disabled={!!busy}
              onClick={() => execute("run")}
              className="btn-secondary flex-1 inline-flex items-center justify-center gap-1.5 text-xs disabled:opacity-50"
            >
              <Play className="h-3.5 w-3.5 text-zinc-400" />
              <span>{busy === "run" ? "Running Test Cases…" : "Run Code"}</span>
            </button>
            <button
              disabled={!!busy}
              onClick={() => execute("submit")}
              className="btn-primary flex-1 inline-flex items-center justify-center gap-1.5 text-xs disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{busy === "submit" ? "Evaluating…" : "Submit Solution"}</span>
            </button>
          </div>

          {error && (
            <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-200">
              {error}
            </p>
          )}

          {result && <Results result={result} />}
          <History submissions={history} onSelect={(s) => s.code && setCode(s.code)} />
        </section>
      </div>
    </main>
  );
}

function Results({ result }: { result: ExecutionResult }) {
  const accepted = result.status === "ACCEPTED";
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2">
        {accepted ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
        ) : (
          <XCircle className="h-5 w-5 text-rose-400" />
        )}
        <h2 className={`text-base font-bold ${accepted ? "text-emerald-400" : "text-rose-400"}`}>
          {accepted ? "Accepted" : format(result.status)}
        </h2>
      </div>

      <p className="mt-2 text-xs text-zinc-400">
        {result.testCasesPassed} / {result.totalTestCases} test cases passed · Runtime: {result.executionTime}ms
      </p>

      {result.testCases.length > 0 && (
        <div className="mt-3 space-y-1.5 font-mono text-xs">
          {result.testCases.map((t) => (
            <div
              key={t.number}
              className={`flex items-center gap-1.5 ${t.passed ? "text-emerald-400" : "text-rose-400"}`}
            >
              {t.passed ? (
                <Check className="h-3.5 w-3.5 shrink-0" />
              ) : (
                <X className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>Test case {t.number} — {t.status}</span>
            </div>
          ))}
        </div>
      )}

      {result.output && (
        <pre className="mt-3 max-h-32 overflow-auto rounded-lg bg-zinc-950 border border-zinc-800 p-3 text-[11px] font-mono text-zinc-300">
          {result.output}
        </pre>
      )}
    </div>
  );
}

function History({
  submissions,
  onSelect
}: {
  submissions: Submission[];
  onSelect: (s: Submission) => void;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-zinc-400" />
        <h2 className="text-sm font-bold text-white">Submission History</h2>
      </div>

      {submissions.length === 0 ? (
        <p className="mt-2.5 text-xs text-zinc-500">No submissions recorded yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {submissions.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s)}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-2.5 text-left text-xs transition hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="flex items-center gap-1.5">
                {s.status === "ACCEPTED" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-rose-400" />
                )}
                <span className={s.status === "ACCEPTED" ? "font-semibold text-emerald-400" : "font-semibold text-rose-400"}>
                  {format(s.status)}
                </span>
              </div>
              <span className="font-mono text-[11px] text-zinc-500">
                Java · {s.executionTime ?? 0}ms · {new Date(s.createdAt).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PageMessage({ message }: { message: string }) {
  return <main className="grid min-h-screen place-items-center text-zinc-400">{message}</main>;
}

