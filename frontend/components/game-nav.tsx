"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Globe,
  GitBranch,
  Skull,
  Trophy,
  Award,
  Code2,
  Volume2,
  VolumeX,
  Flame,
  Zap,
  Menu,
  X,
  LogOut,
  User as UserIcon
} from "lucide-react";
import { sound } from "@/lib/sound";
import { auth } from "@/lib/auth";
import { gameApi } from "@/lib/game-api";
import type { PlayerProfile } from "@/types/game";

export function GameNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [muted, setMuted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMuted(sound.isMuted());
    const currentUser = auth.user();
    if (currentUser) {
      gameApi
        .getProfile()
        .then((p) => setProfile(p))
        .catch(() => {});
    }
  }, []);

  const toggleSound = () => {
    const isNowMuted = sound.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) sound.playClick();
  };

  const handleLogout = () => {
    sound.playClick();
    auth.clear();
    router.replace("/login");
  };

  const navLinks = [
    { href: "/world", label: "Worlds", icon: Globe },
    { href: "/skill-tree", label: "Skill Tree", icon: GitBranch },
    { href: "/boss/boss-chrono-consumer", label: "Boss Battle", icon: Skull },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/achievements", label: "Badges", icon: Award },
    { href: "/problems", label: "Practice Lab", icon: Code2 }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f3ee]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/world"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2 text-xl font-black tracking-[-.06em]"
          >
            <span>peer<span className="text-[#ff765f]">solve</span><span className="ml-1 inline-block h-2 w-2 rounded-full bg-[#c9f36a]" /></span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => sound.playClick()}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? "bg-[#121212] text-white"
                    : "text-[#706f6a] hover:bg-black/5 hover:text-[#121212]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? "text-[#c9f36a]" : "text-[#706f6a]"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Player HUD & Controls */}
        <div className="flex items-center gap-3">
          {profile && (
            <div className="hidden items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-1.5 sm:flex">
              {/* Level Badge */}
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-cyan-400">
                <Zap className="h-3.5 w-3.5 fill-cyan-400 text-cyan-400" />
                <span>LVL {profile.level}</span>
              </div>

              {/* XP Meter */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-2 text-[10px] font-medium text-slate-400">
                  <span>{profile.xp} XP</span>
                  <span className="text-slate-500">NEXT: {profile.xpForNextLevel}</span>
                </div>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          10,
                          ((profile.xp - profile.xpForCurrentLevel) /
                            Math.max(1, profile.xpForNextLevel - profile.xpForCurrentLevel)) *
                            100
                        )
                      )}%`
                    }}
                  />
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-1 rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-xs font-semibold text-amber-400">
                <Flame className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{profile.streakDays}d</span>
              </div>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="rounded-lg border border-black/10 bg-white/50 p-2 text-[#706f6a] transition hover:border-black/20 hover:text-[#121212]"
          >
            {muted ? <VolumeX className="h-4 w-4 text-slate-500" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
          </button>

          {/* User Account / Logout */}
          <Link
            href="/dashboard"
            onClick={() => sound.playClick()}
            className="hidden rounded-lg border border-black/10 bg-white/50 p-2 text-[#706f6a] transition hover:border-black/20 hover:text-[#121212] sm:flex"
            title="Player Command Center"
          >
            <UserIcon className="h-4 w-4" />
          </Link>

          <button
            onClick={handleLogout}
            className="hidden rounded-lg border border-[#ff765f]/30 bg-[#ff765f]/10 p-2 text-[#d94d3b] transition hover:bg-[#ff765f]/20 sm:flex"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg border border-slate-800 p-2 text-slate-300 md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-slate-800 bg-slate-950 px-4 py-4 md:hidden">
          {profile && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-sm font-bold text-cyan-400">LVL {profile.level}</span>
                <span className="text-xs text-slate-400">({profile.xp} XP)</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-amber-400">
                <Flame className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>{profile.streakDays} days streak</span>
              </div>
            </div>
          )}
          <div className="grid gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    sound.playClick();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm font-semibold text-slate-300"
                >
                  <Icon className="h-4 w-4 text-cyan-400" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2 text-sm font-semibold text-slate-300"
            >
              <UserIcon className="h-4 w-4 text-cyan-400" />
              Command Center
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg border border-rose-900/30 bg-rose-950/20 px-3 py-2 text-left text-sm font-semibold text-rose-400"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
