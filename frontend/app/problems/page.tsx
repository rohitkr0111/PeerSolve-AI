"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Sparkles, ArrowRight, Code2 } from "lucide-react";
import api, { apiError } from "@/lib/api";
import type { Problem } from "@/types/problems";
import { Badge, format } from "@/components/problem-ui";
import { Loading } from "@/components/loading";

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
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-7">
      <header className="flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-white">
          Peer<span className="text-indigo-400">Solve</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link className="btn-secondary" href="/dashboard">
            Dashboard
          </Link>
          <Link className="btn-primary inline-flex items-center gap-1.5" href="/world">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Learn Tracks</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <section className="mt-12">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-0.5 text-xs font-semibold text-indigo-300">
          <Code2 className="h-3.5 w-3.5" />
          <span>Practice Library</span>
        </div>
        <h1 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          Algorithm Problem Catalog
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Curated collection of core computer science algorithmic challenges.
        </p>

        {/* Search Bar with Lucide Search icon */}
        <div className="relative mt-6 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Search problems by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Filter label="Difficulty" values={difficulties} current={difficulty} set={setDifficulty} />
        <Filter label="Topics" values={topics} current={topic} set={setTopic} />

        {loading ? (
          <Loading compact className="mt-10 justify-start" message="Loading problem repository…" />
        ) : error ? (
          <p className="mt-10 text-rose-400">{error}</p>
        ) : (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {visible.map((p) => (
              <Link
                key={p.id}
                href={`/problems/${p.id}`}
                className="card p-6 transition hover:-translate-y-0.5 hover:border-indigo-500/60"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-white">{p.title}</h2>
                  <Badge value={p.difficulty} />
                </div>
                <p className="mt-3 text-xs text-zinc-400">
                  {p.topics.map((t) => format(t)).join(" • ")}
                </p>
              </Link>
            ))}
            {visible.length === 0 && (
              <p className="text-zinc-500 col-span-2 py-8 text-center text-sm">
                No matching problems found.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function Filter({
  label,
  values,
  current,
  set
}: {
  label: string;
  values: readonly string[];
  current: string;
  set: (value: any) => void;
}) {
  return (
    <div className="mt-5">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => set(v)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              current === v
                ? "bg-indigo-600 text-white shadow-sm"
                : "border border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:text-white"
            }`}
          >
            {format(v)}
          </button>
        ))}
      </div>
    </div>
  );
}

