"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Fade and rise into view, once.
 *
 * The reveal is CSS-driven and opt-in: the hidden state lives behind `.js`, which
 * the pre-paint script adds, so a render without scripts — a crawler, reader mode,
 * a headless screenshot, JS switched off — gets the finished page rather than a
 * blank one. `prefers-reduced-motion` removes the travel in CSS, not here, so
 * there is nothing to branch on at runtime.
 *
 * `CountUp` used to live here and drove a row of four animated statistics on the
 * home and about pages. Both rows were cut in the redesign — a distributor's
 * credibility is its brand list and its branches, not a counter.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  /** Stagger, in seconds, to match the rest of the motion in the app. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      el.dataset.in = "true";
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = "true";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -64px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("reveal", className)}
      style={delay ? ({ "--reveal-delay": `${Math.round(delay * 1000)}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
