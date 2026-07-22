"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "system" | "light" | "dark";
type Resolved = "light" | "dark";

interface ThemeCtx {
  theme: Theme; // user's choice
  resolved: Resolved; // actual applied theme
  setTheme: (t: Theme) => void;
  cycle: () => void; // system → light → dark → system
}

const Ctx = createContext<ThemeCtx | null>(null);
const KEY = "ms-theme";

function systemPrefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolve(theme: Theme): Resolved {
  if (theme === "system") return systemPrefersDark() ? "dark" : "light";
  return theme;
}

// Applies the resolved theme to <html data-theme>. This is the ONLY writer of
// data-theme, so it can never race with the server-rendered lang/dir attributes.
function apply(theme: Theme) {
  const r = resolve(theme);
  document.documentElement.setAttribute("data-theme", r);
  return r;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolved, setResolved] = useState<Resolved>("light");

  // Load stored choice once, after mount (SSR-safe).
  useEffect(() => {
    let stored: Theme = "system";
    try {
      const s = localStorage.getItem(KEY);
      if (s === "light" || s === "dark" || s === "system") stored = s;
    } catch {
      /* ignore */
    }
    setThemeState(stored);
    setResolved(apply(stored));
  }, []);

  // Follow the OS when in system mode.
  useEffect(() => {
    if (theme !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolved(apply("system"));
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setResolved(apply(t));
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const cycle = useCallback(() => {
    setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system");
  }, [theme, setTheme]);

  return (
    <Ctx.Provider value={{ theme, resolved, setTheme, cycle }}>{children}</Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

/**
 * Pre-paint inline script. Two jobs, both of which must happen before first paint:
 *
 * 1. Apply the saved (or system) theme, so there is no flash of the wrong one.
 * 2. Mark the document as scripted. Scroll reveals hide their content, and that
 *    hidden state is scoped to `.js` — so a renderer that never runs scripts (a
 *    crawler, a reader mode, a user with JS off) gets the fully visible page
 *    instead of a blank one. Setting it here rather than on mount means the
 *    hidden state is in place before anything is painted, so nothing flashes.
 */
export function ThemeScript() {
  const code = `(function(){try{var e=document.documentElement;e.classList.add('js');var s=localStorage.getItem('${KEY}')||'system';var d=(s==='dark')||(s!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches);e.setAttribute('data-theme',d?'dark':'light');}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
