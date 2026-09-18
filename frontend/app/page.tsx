"use client";

import Link from "next/link";
import Image from "next/image";
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
      <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#dedbd3] px-5 py-5 sm:px-8">
        <Link href="/" onClick={() => sound.playClick()} className="flex items-center gap-3 sm:gap-3.5 text-xl font-black tracking-[-.06em] text-[#151515]">
          <Image src="/peersolve-logo.png" alt="PeerSolve" width={42} height={42} className="h-10 w-10 sm:h-11 sm:w-11 object-contain" />
          <span>peer<span className="text-[#87965A]">solve</span><span className="ml-1 inline-block h-2 w-2 rounded-full bg-[#87965A]" /></span>
        </Link>
        <div className="hidden items-center gap-8 text-sm font-semibold text-[#6f6d67] md:flex">
          <a href="#how-it-works" className="transition hover:text-[#121212]">How it works</a>
          <a href="#why-peersolve" className="transition hover:text-[#121212]">Why PeerSolve</a>
          <Link href="/problems" className="transition hover:text-[#121212]">Practice lab</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" onClick={() => sound.playClick()} className="hidden rounded-full px-4 py-2 text-sm font-bold text-[#6f6d67] hover:text-[#121212] sm:block">Log in</Link>
          <Link href="/register" onClick={() => sound.playClick()} className="rounded-full bg-[#121212] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#2a2a2a]">Start learning <ArrowUpRight className="ml-1 inline h-4 w-4" /></Link>
        </div>
      </nav>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-20 pt-14 sm:px-8 sm:pt-24 lg:grid-cols-[1.02fr_.98fr] lg:pb-28">
        <div className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#dedbd3] bg-white px-3 py-1.5 text-xs font-bold text-[#6f6d67]">
            <span className="h-2 w-2 rounded-full bg-[#8fa85a]" /> Learn together. Ship smarter.
          </div>
          <h1 className="max-w-3xl text-[3.6rem] font-black leading-[.94] tracking-[-.075em] sm:text-7xl lg:text-[6.6rem]">
            Become the person who <span className="relative inline-block">gets it.<span className="absolute -bottom-1 left-0 -z-10 h-4 w-full -rotate-2 bg-[#8fa85a]/25" /></span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#6f6d67] sm:text-xl">
            PeerSolve turns intimidating algorithms into small, satisfying wins — with guided missions, an adaptive mentor, and a community that keeps you in the game.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/register" onClick={() => sound.playClick()} className="rounded-full bg-[#121212] px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-[#2a2a2a] hover:-translate-y-0.5">Start your first mission <ArrowUpRight className="ml-2 inline h-4 w-4" /></Link>
            <Link href="/world" onClick={() => sound.playClick()} className="rounded-full border border-[#dedbd3] bg-white px-6 py-4 text-sm font-bold text-[#121212] transition hover:bg-[#f5f3ee]"><Play className="mr-2 inline h-4 w-4 fill-current text-[#8fa85a]" /> See the world</Link>
          </div>
          <div className="mt-9 flex items-center gap-3 text-sm text-[#6f6d67]">
            <div className="flex -space-x-2">
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f5f3ee] bg-[#b86f5d]/20 text-[#b86f5d] text-xs font-black">A</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f5f3ee] bg-[#8fa85a]/20 text-[#8fa85a] text-xs font-black">R</span>
              <span className="grid h-8 w-8 place-items-center rounded-full border-2 border-[#f5f3ee] bg-[#c7b89a]/30 text-[#6f6d67] text-xs font-black">M</span>
            </div>
            <span><strong className="text-[#121212]">2,400+</strong> learners in the loop</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <div className="absolute -right-3 top-10 h-64 w-64 rounded-full bg-[#8fa85a]/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-6 h-56 w-56 rounded-full bg-[#c7b89a]/15 blur-3xl" />
          <div className="noise relative rotate-2 rounded-[34px] border border-[#dedbd3] bg-[#151515] p-3 shadow-2xl shadow-black/10">
            <div className="rounded-[26px] bg-[#222220] p-5 text-white sm:p-7">
              <div className="flex items-center justify-between text-xs text-white/50"><span>YOUR NEXT MOVE</span><span className="flex items-center gap-1 text-[#8fa85a]"><Flame className="h-3.5 w-3.5 fill-[#b86f5d] text-[#b86f5d]" /> 7 day streak</span></div>
              <div className="mt-12"><span className="rounded-full bg-[#8fa85a]/25 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8fa85a]">Mission 04 · Arrays</span><h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">Find the pair.</h2><p className="mt-3 max-w-sm text-sm leading-relaxed text-white/60">Use a hash map to find two numbers that add up to a target. No pressure. Just one good step.</p></div>
              <div className="mt-10 rounded-2xl bg-[#171716] p-4 font-mono text-xs leading-7 text-white/60"><span className="text-[#c7b89a]">const</span> pair = <span className="text-[#8fa85a]">findPair</span>(numbers, target)<br /><span className="text-white/30">// your thinking goes here...</span></div>
              <div className="mt-4 flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-white/60"><Target className="h-4 w-4 text-[#8fa85a]" /> 240 XP available</span><span className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#121212]">Continue <ChevronRight className="ml-1 inline h-3.5 w-3.5" /></span></div>
            </div>
          </div>
          <div className="absolute -bottom-5 -right-2 rounded-2xl border border-[#dedbd3] bg-white px-4 py-3 shadow-md sm:-right-10"><div className="flex items-center gap-2 text-xs font-bold text-[#121212]"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#8fa85a]/20 text-[#8fa85a]"><Check className="h-4 w-4" /></span> Nice. That&apos;s the insight.</div></div>
        </div>
      </section>

      <section id="why-peersolve" className="border-y border-[#dedbd3] bg-white/60">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 sm:px-8 md:grid-cols-3">
          <Feature icon={<Sparkles className="h-5 w-5" />} title="Learn by doing" text="Short missions make the hard parts feel approachable and memorable." />
          <Feature icon={<Users className="h-5 w-5" />} title="Never solve alone" text="An AI mentor nudges your thinking without taking the answer away." />
          <Feature icon={<Zap className="h-5 w-5" />} title="See your momentum" text="A living skill tree turns practice into progress you can be proud of." />
        </div>
      </section>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="max-w-xl"><p className="eyebrow text-[#6f6d67]">A better practice loop</p><h2 className="mt-4 text-4xl font-black tracking-[-.06em] text-[#121212] sm:text-6xl">Small reps.<br /><span className="text-[#8fa85a]">Real confidence.</span></h2></div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">{steps.map((step) => <div key={step.number} className="rounded-3xl border border-[#dedbd3] bg-white p-7 shadow-sm"><span className="text-sm font-black text-[#8fa85a]">{step.number}</span><h3 className="mt-12 text-2xl font-black tracking-tight text-[#121212]">{step.title}</h3><p className="mt-3 leading-relaxed text-[#6f6d67]">{step.text}</p></div>)}</div>
      </section>

      <footer className="bg-[#151515] px-5 py-12 text-white sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 sm:flex-row sm:items-end"><div><div className="text-2xl font-black tracking-[-.06em] flex items-center gap-3"><Image src="/peersolve-logo.png" alt="PeerSolve" width={38} height={38} className="h-9 w-9 object-contain" /><span>peer<span className="text-[#87965A]">solve</span><span className="ml-1 inline-block h-2 w-2 rounded-full bg-[#87965A]" /></span></div><p className="mt-3 max-w-xs text-sm leading-relaxed text-white/45">The focused way to build an intuition for code.</p></div><div className="flex gap-5 text-sm text-white/55"><Link href="/login" className="hover:text-white">Log in</Link><Link href="/register" className="hover:text-white">Create account</Link><Link href="/world" className="hover:text-white">Explore</Link></div></div></footer>
    </main>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="flex gap-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#8fa85a]/15 text-[#8fa85a]">{icon}</div><div><h3 className="font-black text-[#121212]">{title}</h3><p className="mt-1 text-sm leading-relaxed text-[#6f6d67]">{text}</p></div></div>;
}
