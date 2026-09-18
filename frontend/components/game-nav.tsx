"use client";

import Link from "next/link";
import Image from "next/image";
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
    <header className="sticky top-0 z-50 border-b border-[#dedbd3] bg-[#f5f3ee]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/world"
            onClick={() => sound.playClick()}
            className="flex items-center gap-3 sm:gap-3.5 text-xl font-black tracking-[-.06em] text-[#121212]"
          >
            <Image
              src="/peersolve-logo.png"
              alt="PeerSolve"
              width={42}
              height={42}
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain"
            />
            <span>peer<span className="text-[#87965A]">solve</span><span className="ml-1 inline-block h-2 w-2 rounded-full bg-[#87965A]" /></span>
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
                    : "text-[#6f6d67] hover:bg-black/5 hover:text-[#121212]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? "text-[#8fa85a]" : "text-[#6f6d67]"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Player HUD & Controls */}
        <div className="flex items-center gap-3">
          {profile && (
            <div className="hidden items-center gap-3 rounded-xl border border-[#dedbd3] bg-white px-3 py-1.5 shadow-sm sm:flex">
              {/* Level Badge */}
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-[#121212]">
                <Zap className="h-3.5 w-3.5 fill-[#8fa85a] text-[#8fa85a]" />
                <span>LVL {profile.level}</span>
              </div>

              {/* XP Meter */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-2 text-[10px] font-medium text-[#6f6d67]">
                  <span className="font-semibold text-[#121212]">{profile.xp} XP</span>
                  <span>NEXT: {profile.xpForNextLevel}</span>
                </div>
                <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#dedbd3]">
                  <div
                    className="h-full rounded-full bg-[#8fa85a] transition-all duration-500"
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
              <div className="flex items-center gap-1 rounded-full bg-[#c7b89a]/20 px-2 py-0.5 font-mono text-xs font-semibold text-[#6f6d67]">
                <Flame className="h-3.5 w-3.5 fill-[#b86f5d] text-[#b86f5d]" />
                <span>{profile.streakDays}d</span>
              </div>
            </div>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Toggle Sound"
            className="rounded-lg border border-[#dedbd3] bg-white p-2 text-[#6f6d67] transition hover:border-[#121212]/20 hover:text-[#121212] shadow-sm"
          >
            {muted ? <VolumeX className="h-4 w-4 text-[#6f6d67]" /> : <Volume2 className="h-4 w-4 text-[#121212]" />}
          </button>

          {/* User Account / Logout */}
          <Link
            href="/dashboard"
            onClick={() => sound.playClick()}
            className="hidden rounded-lg border border-[#dedbd3] bg-white p-2 text-[#6f6d67] transition hover:border-[#121212]/20 hover:text-[#121212] shadow-sm sm:flex"
            title="Player Command Center"
          >
            <UserIcon className="h-4 w-4" />
          </Link>

          <button
            onClick={handleLogout}
            className="hidden rounded-lg border border-[#dedbd3] bg-white p-2 text-[#6f6d67] transition hover:border-[#b86f5d]/40 hover:text-[#b86f5d] shadow-sm sm:flex"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg border border-[#dedbd3] bg-white p-2 text-[#6f6d67] md:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-b border-[#dedbd3] bg-[#f5f3ee] px-4 py-4 md:hidden">
          {profile && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[#dedbd3] bg-white p-3">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-[#8fa85a]" />
                <span className="font-mono text-sm font-bold text-[#121212]">LVL {profile.level}</span>
                <span className="text-xs text-[#6f6d67]">({profile.xp} XP)</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs text-[#6f6d67]">
                <Flame className="h-4 w-4 fill-[#b86f5d] text-[#b86f5d]" />
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
                  className="flex items-center gap-3 rounded-lg border border-[#dedbd3] bg-white px-3 py-2 text-sm font-semibold text-[#121212]"
                >
                  <Icon className="h-4 w-4 text-[#8fa85a]" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-lg border border-[#dedbd3] bg-white px-3 py-2 text-sm font-semibold text-[#121212]"
            >
              <UserIcon className="h-4 w-4 text-[#8fa85a]" />
              Command Center
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg border border-[#dedbd3] bg-white px-3 py-2 text-left text-sm font-semibold text-[#b86f5d]"
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
