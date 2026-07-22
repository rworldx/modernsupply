"use client";

import { useState } from "react";
import { useLang } from "@/context/language";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Muscat (Al Khoudh) — default inquiry recipient.
const WHATSAPP = "96893806780";

export function InquiryForm() {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text =
      `${t("Inquiry", "استفسار")} — Modern Supply\n` +
      `${t("Name", "الاسم")}: ${name}\n\n${message}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <form
      onSubmit={send}
      className="rounded-[var(--radius-xl)] border border-hairline bg-surface p-7"
    >
      <h2 className="t-h3">{t("Send a message", "أرسل رسالة")}</h2>
      <p className="mt-1.5 text-[0.9375rem] text-muted">
        {t("We reply on WhatsApp, usually the same day.", "نرد عبر واتساب، عادةً في نفس اليوم.")}
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <Label htmlFor="nm">{t("Your name", "اسمك")}</Label>
          <Input
            id="nm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className="bg-bg"
          />
        </div>
        <div>
          <Label htmlFor="ms">{t("Message", "الرسالة")}</Label>
          <Textarea
            id="ms"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            placeholder={t("What do you need?", "ما الذي تحتاجه؟")}
            className="bg-bg"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={!name.trim() || !message.trim()}
        >
          {t("Send on WhatsApp", "إرسال عبر واتساب")}
        </Button>
      </div>
    </form>
  );
}
