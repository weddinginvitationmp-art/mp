import { useTranslation } from "react-i18next";
import { LanguageToggle } from "@/components/common/language-toggle";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useGuest } from "@/hooks/use-guest";

function getGuestSlug(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("guest");
}

export function App() {
  const { t } = useTranslation();
  const slug = getGuestSlug() ?? "test-guest";
  const { guest, loading } = useGuest(slug);

  return (
    <main className="min-h-dvh grid place-items-center px-6">
      <div className="fixed top-5 right-5 flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>
      <div className="text-center">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] opacity-60">{t("hero.subtitle")}</p>
        {guest && (
          <p className="mb-2 font-display text-2xl text-muted-gold">{guest.full_name}</p>
        )}
        <h1 className="font-display text-5xl tracking-tight md:text-7xl">
          Hà Phương <span className="text-muted-gold">&</span> Hoàng Minh
        </h1>
        <p className="mt-6 text-sm uppercase tracking-[0.3em] opacity-60">
          {loading ? "..." : t("hero.comingSoon")}
        </p>
      </div>
    </main>
  );
}
