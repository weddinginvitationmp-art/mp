import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-pill border border-ink/20 px-3 py-1 text-xs uppercase tracking-widest transition hover:bg-ink/5 dark:border-ivory/20 dark:hover:bg-ivory/5"
      aria-label={t("common.toggleTheme")}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
