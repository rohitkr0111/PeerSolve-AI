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
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/world"
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
                    ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 shadow-sm shadow-cyan-500/20"
                    : "text-slate-400 hover:border-slate-800 hover:bg-slate-900/80 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? "text-cyan-400" : "text-slate-400"}`} />
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
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
          >
            {muted ? <VolumeX className="h-4 w-4 text-slate-500" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
          </button>

          {/* User Account / Logout */}
          <Link
            href="/dashboard"
            onClick={() => sound.playClick()}
            className="hidden rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-slate-400 transition hover:border-cyan-500/30 hover:text-cyan-300 sm:flex"
            title="Player Command Center"
          >
            <UserIcon className="h-4 w-4" />
          </Link>

          <button
            onClick={handleLogout}
            className="hidden rounded-lg border border-rose-900/40 bg-rose-950/20 p-2 text-rose-400 transition hover:bg-rose-900/30 sm:flex"
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
