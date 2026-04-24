import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/button";
import { Toast } from "@/components/common/toast";
import { AdminNav, type AdminModule } from "./admin-nav";
import { GuestsModule } from "./guests";
import { LeaderboardModule } from "./leaderboard";
import { LoginForm } from "./login-form";
import { RsvpModule } from "./rsvp";
import { useAdminSession } from "./use-admin-session";
import { WishesModule } from "./wishes";

/**
 * Admin console root. Renders login form if no session, otherwise dashboard shell.
 * Module switching is client-side — lightweight state, no router.
 */
export default function AdminApp() {
  const { t } = useTranslation();
  const { user, loading, signOut } = useAdminSession();
  const [active, setActive] = useState<AdminModule>("guests");

  if (loading) {
    return <div className="flex min-h-dvh items-center justify-center text-sm opacity-60">{t("admin.common.loading")}</div>;
  }

  if (!user) {
    return (
      <>
        <LoginForm />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-dvh bg-surface text-on-surface">
      <header className="sticky top-0 z-20 glass">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <p className="font-display text-sm text-accent">{t("admin.header.title")}</p>
          <span className="text-xs opacity-60 truncate max-w-[180px]">{user.email}</span>
          <div className="ml-auto">
            <Button size="sm" variant="ghost" onClick={() => void signOut()}>
              {t("admin.header.signOut")}
            </Button>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-3">
          <AdminNav active={active} onChange={setActive} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {active === "guests" && <GuestsModule />}
        {active === "rsvp" && <RsvpModule />}
        {active === "wishes" && <WishesModule />}
        {active === "leaderboard" && <LeaderboardModule />}
      </main>

      <Toast />
    </div>
  );
}
