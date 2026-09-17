"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { GameNav } from "@/components/game-nav";
import api, { apiError } from "@/lib/api";
import type { Problem } from "@/types/problems";
import { Search, Code2, ArrowRight, CheckCircle2, ChevronRight } from "lucide-react";

const difficulties = ["ALL", "EASY", "MEDIUM", "HARD"] as const;

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<typeof difficulties[number]>("ALL");
  const [topic, setTopic] = useState("ALL");

  useEffect(() => {
    setLoading(true);
    api
      .get<Problem[]>("/api/problems")
      .then((r) => setProblems(r.data))
      .catch((e) => setError(apiError(e)))
      .finally(() => setLoading(false));
  }, []);

  const topics = useMemo(
    () => ["ALL", ...Array.from(new Set(problems.flatMap((p) => p.topics))).sort()],
    [problems]
  );

  const visible = useMemo(
    () =>
      problems.filter(
        (p) =>
          (difficulty === "ALL" || p.difficulty === difficulty) &&
          (topic === "ALL" || p.topics.includes(topic)) &&
          p.title.toLowerCase().includes(search.toLowerCase())
      ),
    [problems, difficulty, topic, search]
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <GameNav />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-2.5 py-0.5 text-xs text-zinc-400">
              <Code2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Practice Lab</span>
            </div>
            <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Algorithmic Problem Archive
            </h1>
            <p className="mt-1 text-xs text-zinc-400">
              Independent deliberate practice with real-time ADA-7 AST and complexity analysis.
            </p>
          </div>

          <Link
            href="/world"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300"
          >
            <span>Explore Structured Learning Paths</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <section className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
            <input
              placeholder="Search problems by name or algorithm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 pl-10 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Difficulty Tabs */}
            <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/60 p-1">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                    difficulty === d
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Topic Filter */}
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-auto rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
            >
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t === "ALL" ? "All Topics" : t}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Problems List */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
          {loading ? (
            <div className="p-8 text-center text-xs text-zinc-400">Loading problems...</div>
          ) : error ? (
            <div className="p-8 text-center text-xs text-rose-400">{error}</div>
          ) : visible.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">No problems match your current filter.</div>
          ) : (
            <div className="divide-y divide-zinc-800/80">
              {visible.map((p) => {
                const diffBadge =
                  p.difficulty === "EASY"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                    : p.difficulty === "MEDIUM"
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                    : "text-rose-400 bg-rose-500/10 border-rose-500/30";

                return (
                  <Link
                    key={p.id}
                    href={`/problems/${p.id}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 transition hover:bg-zinc-900/80"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-400">
                        #
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-white hover:text-indigo-300">
                          {p.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          {p.topics.map((t) => (
                            <span
                              key={t}
                              className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-[10px] text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-10 sm:pl-0">
                      <span className={`rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${diffBadge}`}>
                        {p.difficulty}
                      </span>
                      <ChevronRight className="h-4 w-4 text-zinc-600" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
