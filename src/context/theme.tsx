"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

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

// localStorage and the OS colour-scheme query are the store; React reads them
// rather than keeping a second copy in state. Copying them into state on mount
// meant the first render always claimed "system"/"light" regardless of the truth,
// and a choice made in another tab went unnoticed until reload.
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Another tab writing the key, and the OS flipping scheme, are both the store
  // changing underneath us.
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("storage", onChange);
  mql.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
    mql.removeEventListener("change", onChange);
  };
}

function readTheme(): Theme {
  try {
    const s = localStorage.getItem(KEY);
    if (s === "light" || s === "dark" || s === "system") return s;
  } catch {
    /* ignore */
  }
  return "system";
}

// Both snapshots return primitives, so they are referentially stable by
// construction — the usual useSyncExternalStore infinite-loop trap does not apply.
const readResolved = (): Resolved => resolve(readTheme());

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme);
  const resolved = useSyncExternalStore(subscribe, readResolved, () => "light" as Resolved);

  // Push the resolved theme at <html data-theme>. This is the ONLY writer of
  // data-theme, so it can never race with the server-rendered lang/dir attributes.
  // An effect is right here: it updates an external system from React state,
  // which is what effects are for.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolved);
  }, [resolved]);

  const setTheme = useCallback((t: Theme) => {
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* ignore */
    }
    emit();
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
