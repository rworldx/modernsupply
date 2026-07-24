"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/context/language";
import { Button } from "@/components/ui/button";

interface Announcement {
  id: string;
  percentOff: number;
  titleEn: string;
  titleAr: string;
  bodyEn: string;
  bodyAr: string;
}

// Dismissal is keyed on the announcement id, so a new offer surfaces again even
// for a visitor who closed the previous one.
const dismissKey = (id: string) => `ms-announce-dismissed:${id}`;

export function AnnouncementPopup() {
  const { lang, t, isRtl } = useLang();
  const reduce = useReducedMotion();
  const [data, setData] = useState<Announcement | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let live = true;
    // A short delay lets the page paint first, so the offer arrives as a beat
    // rather than blocking the first impression.
    const timer = setTimeout(() => {
      fetch("/api/announcement")
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (!live || !j?.announcement) return;
          const a: Announcement = j.announcement;
          let dismissed = false;
          try {
            dismissed = localStorage.getItem(dismissKey(a.id)) === "1";
          } catch {
            /* private mode — treat as not dismissed */
          }
          if (!dismissed) {
            setData(a);
            setOpen(true);
          }
        })
        .catch(() => {});
    }, 900);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, []);

  const close = () => {
    if (data) {
      try {
        localStorage.setItem(dismissKey(data.id), "1");
      } catch {
        /* ignore */
      }
    }
    setOpen(false);
  };

  if (!data) return null;

  // Fall back to the other language if this one's title is blank, so a
  // single-language announcement still reads.
  const title = t(data.titleEn, data.titleAr) || data.titleEn || data.titleAr;
  const body = t(data.bodyEn, data.bodyAr);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[var(--z-modal)] grid place-items-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Scrim */}
          <button
            aria-label={t("Close", "إغلاق")}
            onClick={close}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="announce-title"
            dir={isRtl ? "rtl" : "ltr"}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
            className="chrome relative w-full max-w-md overflow-hidden rounded-[var(--radius-xl)] border border-hairline shadow-2xl"
          >
            {/* Masthead band: the offer stated as a headline, newspaper-style —
                a big figure over a hairline rule, in the single bronze accent. */}
            <div className="border-b border-hairline bg-accent px-7 pb-6 pt-7 text-accent-fg">
              <p className="text-[0.75rem] font-medium uppercase tracking-[0.18em] opacity-80">
                {t("Modern Supply", "الإمداد العصري")}
              </p>
              <p className="mt-3 flex items-baseline gap-1 font-mono tabular-nums">
                <span className="text-[3.5rem] font-bold leading-none">{data.percentOff}%</span>
                <span className="text-[1rem] font-semibold">{t("off", "خصم")}</span>
              </p>
            </div>

            <div className="px-7 pb-7 pt-6">
              <h2 id="announce-title" className="t-h3 text-balance">
                {title}
              </h2>
              {body && <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">{body}</p>}

              <div className="mt-6 flex gap-3">
                <Button asChild className="flex-1" onClick={close}>
                  <Link href={`/${lang}/brands`}>{t("Shop the offer", "تسوّق العرض")}</Link>
                </Button>
                <Button variant="surface" onClick={close}>
                  {t("Maybe later", "لاحقاً")}
                </Button>
              </div>
            </div>

            <button
              onClick={close}
              aria-label={t("Close", "إغلاق")}
              className="absolute end-3 top-3 grid size-8 place-items-center rounded-full text-accent-fg/80 transition-colors hover:bg-white/15 hover:text-accent-fg"
            >
              <X className="size-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
