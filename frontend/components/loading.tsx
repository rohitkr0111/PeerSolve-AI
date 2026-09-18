import { Bot } from "lucide-react";

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
  return (
    <div
      role="status"
      aria-live="polite"
      className={`grid place-items-center font-mono ${
        compact
          ? "min-h-0 text-xs text-slate-500"
          : "min-h-[70vh] text-sm text-cyan-400"
      } ${className}`}
    >
      <div className="flex items-center gap-3">
        <Bot className={compact ? "h-4 w-4 animate-spin" : "h-5 w-5 animate-spin"} />
        <span>{message}</span>
      </div>
    </div>
  );
}
