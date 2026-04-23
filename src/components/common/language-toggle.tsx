import { useTranslation } from "react-i18next";

export function LanguageToggle() {
  const { i18n, t } = useTranslation();
  const next = i18n.language.startsWith("vi") ? "en" : "vi";

  return (
    <button
      type="button"
      onClick={() => void i18n.changeLanguage(next)}
      className="rounded-pill border border-ink/20 px-3 py-1 text-xs uppercase tracking-widest transition hover:bg-ink/5 dark:border-ivory/20 dark:hover:bg-ivory/5"
      aria-label={`Switch language to ${next.toUpperCase()}`}
    >
      {t("common.switchLang")}
    </button>
  );
}
