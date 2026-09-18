"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ChevronRight, Flame, Play, Sparkles, Target, Users, Zap } from "lucide-react";
import { sound } from "@/lib/sound";

const steps = [
  { number: "01", title: "Pick a mission", text: "Follow a path built around the skills you actually want to use." },
  { number: "02", title: "Solve in public", text: "Make your thinking visible, get unstuck quickly, and keep moving." },
  { number: "03", title: "Build your edge", text: "Turn every attempt into progress you can see and feel." }
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f3ee] text-[#121212]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" onClick={() => sound.playClick()} className="flex items-center gap-2 text-[1.15rem] font-black tracking-[-.06em]">
          peer<span className="text-[#ff765f]">solve</span><span className="ml-1 h-2 w-2 rounded-full bg-[#c9f36a]" />
        </Link>
        <div className="hidden items-center gap-8 text-sm font-semibold text-[#706f6a] md:flex">
          <a href="#how-it-works" className="transition hover:text-[#121212]">How it works</a>
          <a href="#why-peersolve" className="transition hover:text-[#121212]">Why PeerSolve</a>
          <Link href="/problems" className="transition hover:text-[#121212]">Practice lab</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" onClick={() => sound.playClick()} className="hidden rounded-full px-4 py-2 text-sm font-bold sm:block">Log in</Link>
          <Link href="/register" onClick={() => sound.playClick()} className="rounded-full bg-[#121212] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#333]">Start learning <ArrowUpRight className="ml-1 inline h-4 w-4" /></Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-24 lg:grid-cols-[1.02fr_.98fr] lg:pb-28">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-3 py-1.5 text-xs font-bold">
            <span className="h-2 w-2 rounded-full bg-[#ff765f]" /> Learn together. Ship smarter.
          </div>
          <h1 className="max-w-3xl text-[3.6rem] font-black leading-[.94] tracking-[-.075em] sm:text-7xl lg:text-[6.6rem]">
            Become the person who <span className="relative inline-block">gets it.<span className="absolute -bottom-1 left-0 -z-10 h-4 w-full -rotate-2 bg-[#c9f36a]" /></span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#706f6a] sm:text-xl">
            PeerSolve turns intimidating algorithms into small, satisfying wins — with guided missions, an adaptive mentor, and a community that keeps you in the game.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/register" onClick={() => sound.playClick()} className="rounded-full bg-[#121212] px-6 py-4 text-sm font-bold text-white shadow-xl shadow-black/10 transition hover:-translate-y-0.5">Start your first mission <ArrowUpRight className="ml-2 inline h-4 w-4" /></Link>
            <Link href="/world" onClick={() => sound.playClick()} className="rounded-full border border-black/15 bg-white/40 px-6 py-4 text-sm font-bold transition hover:bg-white"><Play className="mr-2 inline h-4 w-4 fill-current" /> See the world</Link>
          </div>
          <div className="mt-9 flex items-center gap-3 text-sm text-[#706f6a]">
            <div className="flex -space-x-2"><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f5f3ee] bg-[#ff765f] text-xs font-black">A</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f5f3ee] bg-[#c9f36a] text-xs font-black">R</span><span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f5f3ee] bg-[#b6c5ff] text-xs font-black">M</span></div>
            <span><strong className="text-[#121212]">2,400+</strong> learners in the loop</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -right-3 top-10 h-64 w-64 rounded-full bg-[#c9f36a] blur-3xl" />
          <div className="absolute -bottom-10 -left-6 h-56 w-56 rounded-full bg-[#ff765f]/40 blur-3xl" />
          <div className="noise relative rotate-2 rounded-[34px] border border-black/10 bg-[#151515] p-3 shadow-2xl shadow-black/20">
            <div className="rounded-[26px] bg-[#272727] p-5 text-white sm:p-7">
              <div className="flex items-center justify-between text-xs text-white/50"><span>YOUR NEXT MOVE</span><span className="flex items-center gap-1 text-[#c9f36a]"><Flame className="h-3.5 w-3.5 fill-current" /> 7 day streak</span></div>
              <div className="mt-12"><span className="rounded-full bg-[#c9f36a] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#121212]">Mission 04 · Arrays</span><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Find the pair.</h2><p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">Use a hash map to find two numbers that add up to a target. No pressure. Just one good step.</p></div>
              <div className="mt-10 rounded-2xl bg-[#191919] p-4 font-mono text-xs leading-7 text-white/55"><span className="text-[#ff765f]">const</span> pair = <span className="text-[#c9f36a]">findPair</span>(numbers, target)<br /><span className="text-white/25">// your thinking goes here...</span></div>
              <div className="mt-4 flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-white/50"><Target className="h-4 w-4 text-[#ff765f]" /> 240 XP available</span><span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#121212]">Continue <ChevronRight className="ml-1 inline h-3.5 w-3.5" /></span></div>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-2 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-xl sm:-right-10"><div className="flex items-center gap-2 text-xs font-bold"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#c9f36a]"><Check className="h-4 w-4" /></span> Nice. That&apos;s the insight.</div></div>
        </div>
      </section>

      <section id="why-peersolve" className="border-y border-black/10 bg-white/45">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-14 sm:px-8 md:grid-cols-3">
          <Feature icon={<Sparkles />} title="Learn by doing" text="Short missions make the hard parts feel approachable and memorable." />
          <Feature icon={<Users />} title="Never solve alone" text="An AI mentor nudges your thinking without taking the answer away." />
          <Feature icon={<Zap />} title="See your momentum" text="A living skill tree turns practice into progress you can be proud of." />
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-xl"><p className="eyebrow">A better practice loop</p><h2 className="mt-4 text-4xl font-black tracking-[-.06em] sm:text-6xl">Small reps.<br /><span className="text-[#ff765f]">Real confidence.</span></h2></div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">{steps.map((step) => <div key={step.number} className="rounded-3xl border border-black/10 bg-white/45 p-7"><span className="text-sm font-black text-[#ff765f]">{step.number}</span><h3 className="mt-12 text-2xl font-black tracking-tight">{step.title}</h3><p className="mt-3 leading-relaxed text-[#706f6a]">{step.text}</p></div>)}</div>
      </section>

      <footer className="bg-[#121212] px-5 py-12 text-white sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><div className="text-2xl font-black tracking-[-.06em]">peer<span className="text-[#ff765f]">solve</span><span className="ml-1 inline-block h-2 w-2 rounded-full bg-[#c9f36a]" /></div><p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">The focused way to build an intuition for code.</p></div><div className="flex gap-5 text-sm text-white/55"><Link href="/login" className="hover:text-white">Log in</Link><Link href="/register" className="hover:text-white">Create account</Link><Link href="/world" className="hover:text-white">Explore</Link></div></div></footer>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="flex gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#c9f36a]">{icon}</div><div><h3 className="font-black">{title}</h3><p className="mt-1 text-sm leading-relaxed text-[#706f6a]">{text}</p></div></div>;
}
