import Image from "next/image";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  className?: string;
  compact?: boolean;
}

export function Loading({
  message = "Loading...",
  className = "",
  compact = false
}: LoadingProps) {
  if (compact) {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`flex items-center gap-2 text-xs font-medium text-zinc-400 ${className}`}
      >
        <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`grid min-h-[50vh] place-items-center px-4 ${className}`}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        {/* Subtle Branded Icon & Spinner */}
        <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/80 shadow-sm overflow-hidden p-2">
          <Image
            src="/peersolve-logo.png"
            alt="PeerSolve"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <div className="absolute -inset-0.5 rounded-2xl border border-indigo-500/20 animate-pulse pointer-events-none" />
        </div>

        {/* Message and status */}
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-400" />
          <span>{message}</span>
        </div>
      </div>
    </div>
  );
}
