import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/button";
import { useAdminSession } from "./use-admin-session";

export function LoginForm() {
  const { t } = useTranslation();
  const { signIn } = useAdminSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) setError(err.message);
  };

  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="glass w-full max-w-sm rounded-soft p-6 space-y-4"
      >
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-accent">{t("admin.login.eyebrow")}</p>
          <h1 className="mt-2 font-display text-2xl text-on-surface">{t("admin.login.title")}</h1>
        </header>

        <label className="block">
          <span className="text-xs uppercase tracking-widest text-on-surface-muted">
            {t("admin.login.email")}
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-soft border border-border-subtle bg-surface-muted px-3 py-2 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            autoComplete="username"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-widest text-on-surface-muted">
            {t("admin.login.password")}
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-soft border border-border-subtle bg-surface-muted px-3 py-2 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            autoComplete="current-password"
          />
        </label>

        {error && (
          <p role="alert" className="text-xs text-red-500">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
          {loading ? t("admin.login.signingIn") : t("admin.login.submit")}
        </Button>
      </form>
    </div>
  );
}
