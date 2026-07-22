"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/context/theme";

// Re-exported so existing imports keep working.
export { ThemeScript } from "@/context/theme";

const NEXT: Record<string, string> = {
  system: "Automatic",
  light: "Light",
  dark: "Dark",
};

export function ThemeToggle({ label = "Appearance" }: { label?: string }) {
  const { theme, cycle } = useTheme();

  const Icon = theme === "system" ? Monitor : theme === "light" ? Sun : Moon;

  return (
    <button
      onClick={cycle}
      className="grid size-9 place-items-center rounded-full text-fg/80 transition-colors duration-[var(--duration-hover)] ease-[var(--ease-out)] hover:text-fg"
      aria-label={`${label}: ${NEXT[theme]}`}
      title={NEXT[theme]}
    >
      <Icon className="size-[1.125rem]" strokeWidth={1.5} />
    </button>
  );
}
