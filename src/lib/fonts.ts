import { Geist, Geist_Mono, Tajawal } from "next/font/google";

// One neutral grotesque across the whole hierarchy — differentiated by weight,
// size and tracking rather than by a second display family. On Apple hardware the
// stack in globals.css resolves to SF Pro first; Geist is the fallback everywhere
// else and is close enough in width and terminal shapes to keep the rhythm.
export const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

// Order numbers, phone numbers and stock counts.
export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const fontVars = `${geist.variable} ${geistMono.variable} ${tajawal.variable}`;
