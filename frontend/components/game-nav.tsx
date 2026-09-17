"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Compass,
  Code2,
  BarChart3,
  Trophy,
  Volume2,
  VolumeX,
  Flame,
  Menu,
  X,
  LogOut
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

  const primaryNav = [
    { href: "/world", label: "Learn", icon: Compass },
    { href: "/problems", label: "Practice", icon: Code2 },
    { href: "/dashboard", label: "Progress", icon: BarChart3 }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2.5 text-base font-bold tracking-tight text-white transition hover:opacity-90"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white shadow-sm shadow-indigo-600/30">
              P
            </div>
            <span className="font-semibold tracking-tight">Peer<span className="text-indigo-400">Solve</span></span>
            <span className="hidden rounded-full border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-medium text-zinc-400 sm:inline-block">
              Adaptive AI
            </span>
          </Link>

          {/* Desktop Primary Nav */}
          <nav className="hidden items-center gap-1 sm:flex">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href === "/world" && (pathname.startsWith("/missions") || pathname.startsWith("/boss") || pathname.startsWith("/skill-tree"))) ||
                (item.href === "/problems" && pathname.startsWith("/problems"));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => sound.playClick()}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    active
                      ? "bg-zinc-800/90 text-white shadow-sm"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? "text-indigo-400" : "text-zinc-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Actions & Telemetry */}
        <div className="flex items-center gap-2.5">
          {profile && (
            <div className="flex items-center gap-2.5 rounded-xl border border-zinc-800/80 bg-zinc-900/60 px-3 py-1 text-xs">
              {/* Streak */}
              <div className="flex items-center gap-1 font-medium text-amber-400" title="Active Learning Streak">
                <Flame className="h-3.5 w-3.5 fill-amber-400" />
                <span>{profile.streakDays || 1}d</span>
              </div>

              <div className="h-3 w-px bg-zinc-800" />

              {/* Level & XP */}
              <div className="flex items-center gap-1 text-[11px] text-zinc-400" title="Mastery Level">
                <span className="font-semibold text-zinc-300">Lvl {profile.level}</span>
                <span className="text-zinc-500">· {profile.xp} XP</span>
              </div>
            </div>
          )}

          {/* Secondary Leaderboard Link */}
          <Link
            href="/leaderboard"
            onClick={() => sound.playClick()}
            className="hidden items-center gap-1 rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200 md:flex"
            title="Peer Rankings"
          >
            <Trophy className="h-3.5 w-3.5 text-zinc-400" />
            <span>Rankings</span>
          </Link>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            title={muted ? "Unmute audio" : "Mute audio"}
            className="rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-1.5 text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
          >
            {muted ? <VolumeX className="h-4 w-4 text-zinc-600" /> : <Volume2 className="h-4 w-4 text-indigo-400" />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden rounded-lg border border-zinc-800/80 bg-zinc-900/60 p-1.5 text-zinc-400 transition hover:border-rose-900/40 hover:bg-rose-950/20 hover:text-rose-400 sm:flex"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg border border-zinc-800 p-1.5 text-zinc-300 sm:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-zinc-800 bg-zinc-950 px-4 py-4 sm:hidden">
          <div className="grid gap-1.5">
            {primaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    sound.playClick();
                    setMobileOpen(false);
                  }}
                  className="flex items-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800/60"
                >
                  <Icon className="h-4 w-4 text-indigo-400" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/leaderboard"
              onClick={() => {
                sound.playClick();
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800/60"
            >
              <Trophy className="h-4 w-4 text-zinc-400" />
              Rankings
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg border border-rose-900/30 bg-rose-950/20 px-3 py-2 text-left text-xs font-medium text-rose-400"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
