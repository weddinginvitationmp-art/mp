import { useTranslation } from "react-i18next";

export type AdminModule = "guests" | "rsvp" | "wishes" | "leaderboard";

interface Props {
  active: AdminModule;
  onChange: (m: AdminModule) => void;
}

const MODULES: AdminModule[] = ["guests", "rsvp", "wishes", "leaderboard"];

export function AdminNav({ active, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <nav className="flex flex-wrap gap-2">
      {MODULES.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          aria-current={active === m ? "page" : undefined}
          className={`min-h-[36px] rounded-pill px-4 py-1.5 text-xs uppercase tracking-widest transition ${
            active === m
              ? "bg-accent text-on-accent"
              : "border border-border-subtle text-on-surface hover:bg-surface-muted"
          }`}
        >
          {t(`admin.nav.${m}`)}
        </button>
      ))}
    </nav>
  );
}
