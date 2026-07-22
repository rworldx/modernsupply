"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminLang } from "@/context/admin-language";

export default function AdminLogin() {
  const router = useRouter();
  const { t, toggle } = useAdminLang();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        setError(t("Invalid username or password.", "اسم المستخدم أو كلمة المرور غير صحيحة."));
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError(t("Something went wrong. Please try again.", "حدث خطأ. حاول مرة أخرى."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-4 flex justify-center">
          <button onClick={toggle} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-fg/80 hover:bg-surface-2">
            <Globe className="h-4 w-4" />
            {t("العربية", "English")}
          </button>
        </div>
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 font-display text-xl font-black text-choc-950">
            M
          </span>
          <div>
            <h1 className="font-display text-2xl font-bold">{t("Modern Supply", "الإمداد العصري")}</h1>
            <p className="text-sm text-muted">{t("Admin dashboard", "لوحة تحكم الإدارة")}</p>
          </div>
        </div>

        <form onSubmit={submit} className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4">
            <Label htmlFor="u">{t("Username", "اسم المستخدم")}</Label>
            <Input id="u" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="mb-4">
            <Label htmlFor="p">{t("Password", "كلمة المرور")}</Label>
            <Input id="p" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="mb-4 text-sm text-rose-600 dark:text-rose-400">{error}</p>}
          <Button type="submit" variant="gold" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            {t("Sign in", "تسجيل الدخول")}
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">{t("Authorized personnel only.", "للمصرّح لهم فقط.")}</p>
      </div>
    </div>
  );
}
