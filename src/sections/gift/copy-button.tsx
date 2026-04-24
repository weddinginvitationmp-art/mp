import { useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  value: string;
  label: string;
}

export function CopyButton({ value, label }: Props) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handle = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore — some browsers (non-HTTPS dev) reject clipboard.
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={label}
      aria-live="polite"
      className="rounded-pill border border-border-subtle px-3 py-1 text-[10px] uppercase tracking-widest transition hover:bg-surface-muted"
    >
      {copied ? t("gift.copied") : t("gift.copy")}
    </button>
  );
}
