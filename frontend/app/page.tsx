"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Gamepad2,
  Sparkles,
  Bot,
  Skull,
  GitBranch,
  Trophy,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Flame,
  Zap,
  Play,
  Terminal,
  ShieldAlert
} from "lucide-react";
import { sound } from "@/lib/sound";

export default function HomePage() {
  const [selectedDemoTab, setSelectedDemoTab] = useState<"brute" | "mentor" | "optimized">("mentor");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Background glow meshes */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute top-[40%] right-[-10%] h-[450px] w-[500px] rounded-full bg-indigo-500/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[-10%] h-[400px] w-[500px] rounded-full bg-emerald-500/10 blur-[140px]" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2 text-xl font-extrabold tracking-wider"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              PEERSOLVE
            </span>
            <span className="rounded border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-cyan-400">
              RPG
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-400 md:flex">
            <a href="#loop" className="transition hover:text-cyan-400">Game Loop</a>
            <a href="#simulation" className="transition hover:text-cyan-400">Mission Simulator</a>
            <a href="#boss" className="transition hover:text-cyan-400">Boss Encounters</a>
            <a href="#skill-tree" className="transition hover:text-cyan-400">Skill Tree</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              onClick={() => sound.playClick()}
              className="rounded-xl border border-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-900"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => sound.playClick()}
              className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-5 py-2 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:opacity-90"
            >
              <span>Play Now</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24 text-center sm:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold tracking-widest text-cyan-300">
          <Gamepad2 className="h-4 w-4 text-cyan-400" />
          <span>INTERACTIVE GAME-BASED LEARNING ENGINE</span>
        </div>

        <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
          Don&apos;t Just Study Code.{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Play It. Master It.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
          Enter a living algorithmic world where DSA isn&apos;t endless LeetCode flashcards.
          Solve real missions, get guided by tactical AI mentors, dismantle boss encounters,
          and unlock your visual skill tree.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/register"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-500 px-8 py-4 font-bold text-slate-950 shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <Play className="h-5 w-5 fill-slate-950" />
            <span>Launch Player Campaign</span>
          </Link>
          <Link
            href="/world"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/80 px-8 py-4 font-bold text-slate-300 backdrop-blur-md transition-all hover:border-slate-700 hover:text-white"
          >
            <span>Explore Sectors</span>
          </Link>
        </div>

        {/* Tactical HUD Snapshot */}
        <div className="mx-auto mt-14 max-w-4xl rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-xl sm:p-6">
          <div className="grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
            <div className="border-r border-slate-800/80 pr-4">
              <span className="font-mono text-xs text-slate-400">ACTIVE WORLDS</span>
              <p className="mt-1 text-2xl font-bold text-slate-100">3 Sectors</p>
              <span className="text-[11px] text-cyan-400">Arrays → Two Pointer → Hashing</span>
            </div>
            <div className="border-r border-slate-800/80 pr-4">
              <span className="font-mono text-xs text-slate-400">AI MENTOR</span>
              <p className="mt-1 text-2xl font-bold text-slate-100">ADA-7 NPC</p>
              <span className="text-[11px] text-emerald-400">Contextual Misconception Engine</span>
            </div>
            <div className="border-r border-slate-800/80 pr-4">
              <span className="font-mono text-xs text-slate-400">BOSS BATTLES</span>
              <p className="mt-1 text-2xl font-bold text-slate-100">4 Stages</p>
              <span className="text-[11px] text-rose-400">Diagnose → Fix → Optimize → Explain</span>
            </div>
            <div>
              <span className="font-mono text-xs text-slate-400">PROGRESSION</span>
              <p className="mt-1 text-2xl font-bold text-slate-100">XP &amp; Skill Tree</p>
              <span className="text-[11px] text-amber-400">Real MongoDB Persisted Mastery</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Game Loop */}
      <section id="loop" className="relative z-10 border-t border-slate-800/80 bg-slate-900/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-cyan-400">
              LEARNING ARCHITECTURE
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">The 7-Step Gameplay Loop</h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              Traditional platforms test you with questions and answers. PeerSolve immerses you in a gameplay progression cycle.
            </p>
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
            {[
              { step: "01", title: "Learn", desc: "Briefing on problem & telemetry context", icon: Terminal, color: "text-cyan-400" },
              { step: "02", title: "Play", desc: "Interactive in-editor code execution", icon: Play, color: "text-teal-400" },
              { step: "03", title: "Fail Safely", desc: "System triggers real runtime test vector errors", icon: ShieldAlert, color: "text-rose-400" },
              { step: "04", title: "AI Guidance", desc: "ADA-7 pinpoints the misconception & progressive hints", icon: Bot, color: "text-amber-400" },
              { step: "05", title: "Improve", desc: "Refactor quadratic loops to O(1) lookups", icon: Zap, color: "text-indigo-400" },
              { step: "06", title: "Defeat Boss", desc: "Multi-stage tactical boss confrontations", icon: Skull, color: "text-red-400" },
              { step: "07", title: "Mastery", desc: "Unlock skill tree branches & level up XP", icon: Trophy, color: "text-emerald-400" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="group relative rounded-2xl border border-slate-800 bg-slate-900/40 p-5 transition-all hover:-translate-y-1 hover:border-cyan-500/40 hover:bg-slate-900/80"
                >
                  <span className="font-mono text-xs font-bold text-slate-500 group-hover:text-cyan-400">
                    {item.step}
                  </span>
                  <div className={`mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 font-bold text-slate-100">{item.title}</h3>
                  <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Simulation Showcase */}
      <section id="simulation" className="relative z-10 border-t border-slate-800/80 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold text-amber-300">
                <Bot className="h-3.5 w-3.5" />
                <span>AI NOT A CHATBOT // REAL PEDAGOGICAL ENGINE</span>
              </div>
              <h2 className="mt-4 text-3xl font-extrabold sm:text-5xl">
                Teaches Through Gameplay, Not Cheating.
              </h2>
              <p className="mt-4 text-slate-400">
                Generic chatbots hand you the answer and rob you of learning. ADA-7 detects your specific algorithmic misconception (like checking every pair in nested loops) and provides 3-tier progressive hints.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                  <div>
                    <p className="font-semibold text-slate-200">Misconception Detection</p>
                    <p className="text-xs text-slate-400">Analyzes AST &amp; execution telemetry to explain why O(N²) quadratic loops choke on big inputs.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                  <div>
                    <p className="font-semibold text-slate-200">Progressive 3-Tier Hints</p>
                    <p className="text-xs text-slate-400">Tier 1 Conceptual Nudge → Tier 2 Algorithmic Direction → Tier 3 Tactical Blueprint.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                  <div>
                    <p className="font-semibold text-slate-200">Adaptive Difficulty Engine</p>
                    <p className="text-xs text-slate-400">Tracks attempt counts, hint penalties, and topic mastery to personalize the next mission.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Terminal Demo Widget */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl shadow-cyan-950/30">
              <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                  <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-xs text-slate-400">mission_simulation.java</span>
                </div>
                <div className="flex gap-1 font-mono text-xs">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedDemoTab("brute");
                    }}
                    className={`rounded px-2 py-1 ${selectedDemoTab === "brute" ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "text-slate-400"}`}
                  >
                    Attempt #1 (Naive)
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedDemoTab("mentor");
                    }}
                    className={`rounded px-2 py-1 ${selectedDemoTab === "mentor" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400"}`}
                  >
                    ADA-7 Guidance
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setSelectedDemoTab("optimized");
                    }}
                    className={`rounded px-2 py-1 ${selectedDemoTab === "optimized" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "text-slate-400"}`}
                  >
                    Attempt #2 (O(N))
                  </button>
                </div>
              </div>

              <div className="p-5 font-mono text-xs leading-relaxed">
                {selectedDemoTab === "brute" && (
                  <div className="space-y-3">
                    <p className="text-slate-500">// Naive pair search: O(N²) nested loops</p>
                    <pre className="text-rose-300">
{`for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) {
        if (nums[i] + nums[j] == target) {
            return new int[]{i, j};
        }
    }
}`}
                    </pre>
                    <div className="rounded-lg border border-rose-500/30 bg-rose-950/30 p-3 text-rose-200">
                      [FAILED] Quadratic loop detected. Telemetry: 450ms. Expected: O(N).
                    </div>
                  </div>
                )}

                {selectedDemoTab === "mentor" && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <Bot className="h-4 w-4" />
                      <span className="font-bold">ADA-7 // TACTICIAN INTERVENTION</span>
                    </div>
                    <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-amber-200">
                      <p className="font-semibold text-amber-300">Misconception: Quadratic Loop</p>
                      <p className="mt-1 text-slate-300">
                        &quot;Your solution is checking every possible pair. Can you find a way to remember numbers you&apos;ve already scanned instead of scanning the array again?&quot;
                      </p>
                      <div className="mt-3 rounded bg-slate-900/80 p-2 text-xs text-amber-300">
                        💡 Tier 1 Hint: Store complement `target - nums[i]` in a HashMap for O(1) lookup!
                      </div>
                    </div>
                  </div>
                )}

                {selectedDemoTab === "optimized" && (
                  <div className="space-y-3">
                    <p className="text-slate-500">// Single pass O(N) HashMap solution</p>
                    <pre className="text-emerald-300">
{`Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < n; i++) {
    int complement = target - nums[i];
    if (seen.containsKey(complement)) {
        return new int[]{seen.get(complement), i};
    }
    seen.put(nums[i], i);
}`}
                    </pre>
                    <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-emerald-200">
                      [PASSED] Accepted! Runtime: 1ms (O(N) linear time). +150 XP awarded!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boss Battles Section */}
      <section id="boss" className="relative z-10 border-t border-slate-800/80 bg-slate-900/20 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-3xl border border-rose-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/20 p-8 shadow-2xl sm:p-12">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 font-mono text-xs font-bold text-rose-400">
                <Skull className="h-4 w-4" />
                <span>EPIC BOSS ENCOUNTER</span>
              </div>
              <h2 className="mt-4 text-3xl font-black sm:text-5xl">
                Boss: The Chrono-Consumer
              </h2>
              <p className="mt-2 text-lg font-semibold text-rose-300">
                Guardian of the Quadratic Abyss • 4 Tactical Stages
              </p>
              <p className="mt-4 text-slate-400">
                Boss battles test multiple algorithmic competencies in sequence. You don&apos;t just code — you diagnose bugs, patch implementations, optimize memory under strict telemetry, and defend your trade-offs to the AI Mentor.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-rose-500/20 bg-slate-900/80 p-3">
                  <span className="font-mono text-xs font-bold text-rose-400">STAGE 1</span>
                  <p className="font-bold text-slate-200">Diagnose</p>
                  <p className="text-[11px] text-slate-400">Spot infinite recursion loop</p>
                </div>
                <div className="rounded-xl border border-rose-500/20 bg-slate-900/80 p-3">
                  <span className="font-mono text-xs font-bold text-rose-400">STAGE 2</span>
                  <p className="font-bold text-slate-200">Fix</p>
                  <p className="text-[11px] text-slate-400">Patch pointer boundary code</p>
                </div>
                <div className="rounded-xl border border-rose-500/20 bg-slate-900/80 p-3">
                  <span className="font-mono text-xs font-bold text-rose-400">STAGE 3</span>
                  <p className="font-bold text-slate-200">Optimize</p>
                  <p className="text-[11px] text-slate-400">Achieve single-pass O(N)</p>
                </div>
                <div className="rounded-xl border border-rose-500/20 bg-slate-900/80 p-3">
                  <span className="font-mono text-xs font-bold text-rose-400">STAGE 4</span>
                  <p className="font-bold text-slate-200">Explain</p>
                  <p className="text-[11px] text-slate-400">AI Mentor oral defense</p>
                </div>
              </div>

              <div className="mt-8">
                <Link
                  href="/boss/boss-chrono-consumer"
                  onClick={() => sound.playClick()}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-6 py-3 font-bold text-slate-950 shadow-lg shadow-rose-500/20 transition hover:opacity-95"
                >
                  <Skull className="h-5 w-5" />
                  <span>Enter Boss Arena</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="relative z-10 border-t border-slate-800 py-16 text-center">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-extrabold sm:text-4xl">Ready to Start Your Journey?</h2>
          <p className="mt-2 text-slate-400">
            Create your player profile, calibrate your skill tree, and conquer the Silicon Plains.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/register"
              onClick={() => sound.playClick()}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-500 px-8 py-3.5 font-bold text-slate-950 shadow-xl shadow-cyan-500/25 transition hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              onClick={() => sound.playClick()}
              className="rounded-2xl border border-slate-800 px-8 py-3.5 font-bold text-slate-300 transition hover:bg-slate-900"
            >
              Player Login
            </Link>
          </div>
          <p className="mt-12 text-xs text-slate-600">
            PeerSolve RPG • Powered by Next.js, Spring Boot, MongoDB Atlas &amp; Ada-7 Tactician AI
          </p>
        </div>
      </footer>
    </div>
  );
}
