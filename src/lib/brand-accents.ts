// One muted tint per brand, used in exactly two places: the monogram tile and a
// 6px dot. The previous set was fully saturated Tailwind 500s (amber/rose/emerald/
// sky/violet/orange), which read as a rainbow across a seven-brand index. These are
// the same hues pulled down to near-ink lightness so the page stays monochrome and
// the tint only does wayfinding work.
//
// Class strings must stay literal — Tailwind scans source text, not runtime values.

export interface Accent {
  /** Monogram + dot colour. */
  text: string;
  /** Tile fill behind the monogram. */
  soft: string;
  /** Solid dot. */
  dot: string;
}

const ACCENTS: Record<string, Accent> = {
  amber: {
    text: "text-[#8a6a12] dark:text-[#d9b04a]",
    soft: "bg-[#8a6a12]/8 dark:bg-[#d9b04a]/12",
    dot: "bg-[#8a6a12] dark:bg-[#d9b04a]",
  },
  rose: {
    text: "text-[#8c4a4f] dark:text-[#d79aa0]",
    soft: "bg-[#8c4a4f]/8 dark:bg-[#d79aa0]/12",
    dot: "bg-[#8c4a4f] dark:bg-[#d79aa0]",
  },
  emerald: {
    text: "text-[#3f6b52] dark:text-[#86bfa0]",
    soft: "bg-[#3f6b52]/8 dark:bg-[#86bfa0]/12",
    dot: "bg-[#3f6b52] dark:bg-[#86bfa0]",
  },
  sky: {
    text: "text-[#3c5f7d] dark:text-[#8fb8d8]",
    soft: "bg-[#3c5f7d]/8 dark:bg-[#8fb8d8]/12",
    dot: "bg-[#3c5f7d] dark:bg-[#8fb8d8]",
  },
  violet: {
    text: "text-[#5a5183] dark:text-[#a99fd4]",
    soft: "bg-[#5a5183]/8 dark:bg-[#a99fd4]/12",
    dot: "bg-[#5a5183] dark:bg-[#a99fd4]",
  },
  orange: {
    text: "text-[#8a5a2d] dark:text-[#d9a06a]",
    soft: "bg-[#8a5a2d]/8 dark:bg-[#d9a06a]/12",
    dot: "bg-[#8a5a2d] dark:bg-[#d9a06a]",
  },
  primary: {
    text: "text-accent",
    soft: "bg-accent/8",
    dot: "bg-accent",
  },
};

export function accent(token: string): Accent {
  return ACCENTS[token] ?? ACCENTS.primary;
}
