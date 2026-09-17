"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Terminal,
  BrainCircuit,
  Bot,
  Zap,
  GitBranch,
  Target,
  CheckCircle2,
  Check,
  ChevronRight,
  Code2,
  BarChart3,
  Layers,
  Sparkles,
  HelpCircle
} from "lucide-react";
import { sound } from "@/lib/sound";

export default function HomePage() {
  // Interactive Simulator Tab state
  const [selectedDemoTab, setSelectedDemoTab] = useState<"attempt" | "diagnosis" | "challenge" | "adaptive">("diagnosis");
  
  // Interactive Micro-Challenge selection on landing page
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null);
  const [choiceSubmitted, setChoiceSubmitted] = useState(false);

  const learningLoop = [
    {
      num: "01",
      step: "ATTEMPT",
      title: "Real Code Execution",
      desc: "Student writes Java/DSA code and executes against rigorous test suites.",
      icon: Terminal,
      highlight: "border-zinc-800 bg-zinc-900/60 text-zinc-300"
    },
    {
      num: "02",
      step: "AI ANALYSIS",
      title: "Deep Thinking Trace",
      desc: "PeerSolve inspects loop invariants, nested lookups, and memory allocations.",
      icon: BrainCircuit,
      highlight: "border-zinc-800 bg-zinc-900/60 text-zinc-300"
    },
    {
      num: "03",
      step: "MISCONCEPTION",
      title: "Root Cause Isolation",
      desc: "Identifies whether the issue is algorithmic, boundary drift, or spatial awareness.",
      icon: Bot,
      highlight: "border-indigo-500/30 bg-indigo-500/10 text-indigo-300"
    },
    {
      num: "04",
      step: "TARGETED INTERVENTION",
      title: "Socratic Guidance",
      desc: "Provides progressive conceptual clues without spoiling the answer.",
      icon: Zap,
      highlight: "border-zinc-800 bg-zinc-900/60 text-zinc-300"
    },
    {
      num: "05",
      step: "MICRO-CHALLENGE",
      title: "Active Mental Check",
      desc: "A 30-second concept check verifies understanding before rewriting code.",
      icon: HelpCircle,
      highlight: "border-amber-500/30 bg-amber-500/10 text-amber-300"
    },
    {
      num: "06",
      step: "ADAPTIVE NEXT STEP",
      title: "Calibrated Progression",
      desc: "Dynamically selects the next problem tailored to fix identified weaknesses.",
      icon: Target,
      highlight: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    }
  ];

  const microOptions = [
    { id: 0, label: "Array (linear scan)", correct: false, expl: "A linear scan takes O(n) per check, keeping total complexity at O(n²)." },
    { id: 1, label: "HashSet (hash lookup)", correct: true, expl: "HashSet offers O(1) average lookup time, dropping overall runtime to O(n)." },
    { id: 2, label: "Stack (LIFO order)", correct: false, expl: "Stack only grants immediate O(1) access to the top element, not arbitrary lookups." },
    { id: 3, label: "Queue (FIFO order)", correct: false, expl: "Queue only grants immediate access to the front element, requiring full scan." }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-sm shadow-indigo-600/30">
              P
            </div>
            <span className="font-semibold tracking-tight">Peer<span className="text-indigo-400">Solve</span></span>
            <span className="hidden rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline-block">
              Adaptive AI
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-xs font-medium text-zinc-400 md:flex">
            <a href="#learning-loop" className="transition hover:text-white">Learning Loop</a>
            <a href="#ai-diagnosis" className="transition hover:text-white">AI Diagnosis</a>
            <a href="#micro-challenge" className="transition hover:text-white">Micro-Challenges</a>
            <a href="#curriculum" className="transition hover:text-white">Curriculum</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              onClick={() => sound.playClick()}
              className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => sound.playClick()}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-500"
            >
              <span>Start Learning</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs text-zinc-300 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>AI-Native Coding Education</span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">Beyond test pass/fail</span>
          </div>

          <h1 className="mt-7 text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.1]">
            Don&apos;t just solve more problems.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400">
              Learn from the way you solve them.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
            PeerSolve analyzes your coding approach, identifies misconceptions in real time, and dynamically adapts what you learn next.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/register"
              onClick={() => sound.playClick()}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm shadow-indigo-600/25 transition hover:bg-indigo-500"
            >
              <span>Start Learning</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#ai-diagnosis"
              onClick={() => sound.playClick()}
              className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-5 py-3 text-sm font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
            >
              Explore How It Works
            </a>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-14 grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-8 sm:grid-cols-4 text-left">
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
              <div className="text-xl font-bold text-white">AST-Level</div>
              <div className="text-xs text-zinc-400 mt-0.5">Code reasoning analysis</div>
            </div>
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
              <div className="text-xl font-bold text-white">3-Tier</div>
              <div className="text-xs text-zinc-400 mt-0.5">Socratic hint progression</div>
            </div>
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
              <div className="text-xl font-bold text-white">Targeted</div>
              <div className="text-xs text-zinc-400 mt-0.5">Micro-challenge interventions</div>
            </div>
            <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
              <div className="text-xl font-bold text-white">4-Stage</div>
              <div className="text-xs text-zinc-400 mt-0.5">Topic mastery certification</div>
            </div>
          </div>
        </div>
      </section>

      {/* The 6-Stage Learning Loop */}
      <section id="learning-loop" className="border-t border-zinc-800/80 bg-zinc-950 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              THE ADAPTIVE ENGINE
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl tracking-tight">
              The PeerSolve Learning Loop
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Instead of guessing answers, PeerSolve constructs an active mental model through deliberate, guided feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {learningLoop.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.num}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 transition hover:border-zinc-700 hover:bg-zinc-900/70"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-bold text-zinc-500">{item.num}</span>
                    <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-400">
                      {item.step}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${item.highlight}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-400">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive AI Diagnosis Experience */}
      <section id="ai-diagnosis" className="border-t border-zinc-800/80 bg-zinc-900/20 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              CORE PRODUCT EXPERIENCE
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl tracking-tight">
              An Intelligent Code Review, Not Just &quot;Accepted&quot;
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              When you submit a solution that works but is quadratic, PeerSolve isolates the exact algorithmic pattern and teaches the mental shift.
            </p>
          </div>

          {/* Interactive Playground Simulation */}
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 bg-zinc-900/80 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="h-3 w-3 rounded-full bg-zinc-700" />
                <span className="ml-2 font-mono text-xs text-zinc-400">Problem 01 · Contains Duplicate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSelectedDemoTab("attempt")}
                  className={`rounded-lg px-3 py-1 font-mono text-xs font-medium transition ${
                    selectedDemoTab === "attempt" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  1. Student Code
                </button>
                <button
                  onClick={() => setSelectedDemoTab("diagnosis")}
                  className={`rounded-lg px-3 py-1 font-mono text-xs font-medium transition ${
                    selectedDemoTab === "diagnosis" ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  2. AI Diagnosis
                </button>
                <button
                  onClick={() => setSelectedDemoTab("challenge")}
                  className={`rounded-lg px-3 py-1 font-mono text-xs font-medium transition ${
                    selectedDemoTab === "challenge" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  3. Micro-Challenge
                </button>
                <button
                  onClick={() => setSelectedDemoTab("adaptive")}
                  className={`rounded-lg px-3 py-1 font-mono text-xs font-medium transition ${
                    selectedDemoTab === "adaptive" ? "bg-zinc-800 text-white" : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  4. Adaptive Next Step
                </button>
              </div>
            </div>

            {/* Tab Body */}
            <div className="p-6">
              {selectedDemoTab === "attempt" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Submitted Java Solution (Functional but $O(N^2)$ Quadratic):</span>
                    <span className="font-mono text-amber-400">Status: Passed Tests (Inefficient)</span>
                  </div>
                  <pre className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 font-mono text-xs leading-relaxed text-zinc-300 overflow-x-auto">
{`public boolean containsDuplicate(int[] nums) {
    // Student used nested loops to scan for identical values
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] == nums[j]) {
                return true;
            }
        }
    }
    return false;
}`}
                  </pre>
                  <div className="text-right">
                    <button
                      onClick={() => setSelectedDemoTab("diagnosis")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
                    >
                      <span>View AI Diagnosis</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {selectedDemoTab === "diagnosis" && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
                      <Bot className="h-4 w-4" />
                      <span>AI DIAGNOSIS — LEARNING PATTERN RECOGNIZED</span>
                    </div>
                    <p className="mt-1.5 text-sm font-medium text-white">
                      Your solution is logically correct, but your approach has an algorithmic bottleneck.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Detected Pattern</span>
                      <div className="mt-1 font-mono text-xs text-indigo-300 font-bold">Nested Iteration ($O(N^2)$ Complexity)</div>
                      <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                        For each element at index <code className="text-zinc-200">i</code>, the inner loop conducts a linear scan across the remaining array.
                      </p>
                    </div>

                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">What to Understand</span>
                      <div className="mt-1 text-xs font-bold text-zinc-200">Repeated Search Redundancy</div>
                      <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                        You are re-scanning elements you have already seen. An auxiliary structure can remember previous values in $O(1)$ time.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
                    <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wide">Why This Matters</h4>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                      With N = 100,000 elements, nested iteration performs ~5 billion operations (&gt; 5.0 seconds, Time Limit Exceeded). A single-pass approach with a hash lookup takes 100,000 operations (&asymp; 0.002s).
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-zinc-500 font-mono">Next: Verify mental model</span>
                    <button
                      onClick={() => setSelectedDemoTab("challenge")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
                    >
                      <span>Try Micro-Challenge</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {selectedDemoTab === "challenge" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wide">
                      <Zap className="h-4 w-4" />
                      <span>TARGETED MICRO-CHALLENGE</span>
                    </div>
                    <p className="mt-1.5 text-sm text-zinc-200">
                      You used nested loops to find duplicates. Before rewriting your code, answer this:
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      Which data structure allows checking whether an element was previously seen in $O(1)$ average time?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    {microOptions.map((opt) => {
                      const isSelected = selectedChoice === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSelectedChoice(opt.id);
                            setChoiceSubmitted(true);
                            sound.playClick();
                          }}
                          className={`flex items-center justify-between rounded-xl border p-3 text-left transition ${
                            isSelected
                              ? opt.correct
                                ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200"
                                : "border-rose-500/50 bg-rose-500/10 text-rose-200"
                              : "border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                          }`}
                        >
                          <span className="text-xs font-medium">{opt.label}</span>
                          {choiceSubmitted && isSelected && (
                            opt.correct ? <Check className="h-4 w-4 text-emerald-400" /> : <span className="text-xs text-rose-400">Try again</span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {choiceSubmitted && selectedChoice !== null && (
                    <div className={`rounded-xl border p-3.5 text-xs ${
                      microOptions[selectedChoice].correct
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                    }`}>
                      <p className="font-semibold">{microOptions[selectedChoice].correct ? "Correct Choice!" : "Conceptual Clarification:"}</p>
                      <p className="mt-0.5 text-zinc-300">{microOptions[selectedChoice].expl}</p>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setSelectedDemoTab("adaptive")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-indigo-500"
                    >
                      <span>See Adaptive Next Step</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {selectedDemoTab === "adaptive" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                      <Target className="h-4 w-4" />
                      <span>DYNAMIC ADAPTIVE RECOMMENDATION</span>
                    </div>
                    <p className="mt-1.5 text-sm font-semibold text-white">
                      Recommended Next Step: Two-Sum via Hash Table Lookup
                    </p>
                    <p className="mt-1 text-xs text-zinc-400">
                      Reason: You understand linear array iteration. Now reinforce single-pass hashing before proceeding to dynamic programming.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
                      <div className="text-[11px] text-zinc-500 font-semibold uppercase">Array Traversal</div>
                      <div className="mt-1 text-sm font-bold text-white">92% Mastery</div>
                      <div className="mt-1.5 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[92%]" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
                      <div className="text-[11px] text-zinc-500 font-semibold uppercase">Hash-Based Optimization</div>
                      <div className="mt-1 text-sm font-bold text-indigo-400">45% In Progress</div>
                      <div className="mt-1.5 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full w-[45%]" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3.5">
                      <div className="text-[11px] text-zinc-500 font-semibold uppercase">Time Complexity Score</div>
                      <div className="mt-1 text-sm font-bold text-amber-400">+28% Improvement</div>
                      <div className="mt-1.5 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[65%]" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-medium text-white transition hover:bg-indigo-500"
                    >
                      <span>Create Account &amp; Start Curriculum</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Tracks Preview */}
      <section id="curriculum" className="border-t border-zinc-800/80 bg-zinc-950 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              STRUCTURED CURRICULUM
            </span>
            <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl tracking-tight">
              Deliberate Learning Paths
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400">
              Each topic module integrates concept lessons, deliberate practice, edge-case analysis, and verifiable 4-stage mastery milestones.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Track 1 */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-400">Track 01</span>
                  <span className="text-xs font-semibold text-emerald-400">80% Mastery</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white">Arrays &amp; Linear Traversal</h3>
                <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                  Memory layout, continuous indexing, in-place swaps, and avoiding index out-of-bounds traps.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Linear Scanning &amp; Boundary Guards</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Prefix Sums &amp; Running Products</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Mastery Milestone: Array Diagnostics</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80">
                <Link href="/world" className="flex items-center justify-between text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                  <span>Enter Track</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Track 2 */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-400">Track 02</span>
                  <span className="text-xs font-semibold text-indigo-400">60% Mastery</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white">Searching &amp; Two Pointers</h3>
                <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                  Inward converging pointers, sliding windows, monotonic properties, and logarithmic search.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Inward Converging Pointers</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Binary Search Boundary Invariants</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className="h-3.5 w-3.5 rounded-full border border-zinc-700 flex items-center justify-center text-[9px]">·</span>
                    <span>Mastery Milestone: Pointer Optimization</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80">
                <Link href="/world" className="flex items-center justify-between text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                  <span>Enter Track</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Track 3 */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 font-mono text-[10px] font-semibold text-zinc-400">Track 03</span>
                  <span className="text-xs font-semibold text-zinc-500">30% Mastery</span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white">Hash Tables &amp; Frequency Maps</h3>
                <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">
                  Trading $O(N)$ space for $O(1)$ lookups, collision handling, and complement pairing.
                </p>
                <div className="mt-4 space-y-1.5 text-xs text-zinc-400">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Single-Pass Complement Lookup</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className="h-3.5 w-3.5 rounded-full border border-zinc-700 flex items-center justify-center text-[9px]">·</span>
                    <span>Frequency Bucket Counter</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <span className="h-3.5 w-3.5 rounded-full border border-zinc-700 flex items-center justify-center text-[9px]">·</span>
                    <span>Mastery Milestone: Hash Table Defense</span>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80">
                <Link href="/world" className="flex items-center justify-between text-xs font-semibold text-indigo-400 hover:text-indigo-300">
                  <span>Enter Track</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 px-6 py-12">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-indigo-600 font-bold text-white text-[10px]">
              P
            </div>
            <span className="font-semibold text-zinc-300">PeerSolve</span>
            <span>· AI-Native Adaptive Coding Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/world" className="hover:text-zinc-300 transition">Learn</Link>
            <Link href="/problems" className="hover:text-zinc-300 transition">Practice</Link>
            <Link href="/dashboard" className="hover:text-zinc-300 transition">Progress</Link>
            <Link href="/login" className="hover:text-zinc-300 transition">Sign In</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}