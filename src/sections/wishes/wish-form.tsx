import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useGuestContext } from "@/hooks/use-guest-context";
import { submitWish, type FeedWish } from "@/lib/wishes";
import { showToast } from "@/hooks/use-toast";
import { inputBaseClasses } from "@/sections/rsvp/form-field";

const MAX_CHARS = 500;
const SUBMIT_LOCKOUT_MS = 3000;

interface Props {
  onSubmitted: (wish: FeedWish) => void;
}

export function WishForm({ onSubmitted }: Props) {
  const { t } = useTranslation();
  const { guest, slug } = useGuestContext();
  const [name, setName] = useState(guest?.full_name ?? "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep name in sync if guest resolves after mount.
  if (guest?.full_name && name === "") setName(guest.full_name);

  const charCount = message.length;
  const canSubmit = !submitting && name.trim().length >= 2 && message.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    const result = await submitWish(
      { fullName: name.trim(), message: message.trim() },
      { guestId: guest?.id ?? null, slug },
    );
    if (result.ok) {
      onSubmitted(result.wish);
      setMessage("");
      showToast(t("wishes.sent"));
      // Brief lockout prevents accidental double-post
      window.setTimeout(() => setSubmitting(false), SUBMIT_LOCKOUT_MS);
    } else {
      setError(result.error);
      setSubmitting(false);
    }
  };

  const counterClass =
    charCount > MAX_CHARS - 20
      ? "text-red-400/90"
      : charCount > MAX_CHARS - 100
        ? "text-amber-400/90"
        : "opacity-50";

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-soft border border-ivory/15 bg-ivory/5 p-5 dark:bg-ink/30">
      <input
        type="text"
        placeholder={t("wishes.placeholder.name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        minLength={2}
        maxLength={255}
        className={`${inputBaseClasses} py-2`}
      />
      <div>
        <textarea
          rows={4}
          placeholder={t("wishes.placeholder.message")}
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
          required
          className={`${inputBaseClasses} resize-none`}
        />
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className={counterClass}>
            {charCount} / {MAX_CHARS}
          </span>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-pill bg-muted-gold px-5 py-2 text-[11px] uppercase tracking-widest text-ink transition hover:bg-muted-gold/90 disabled:opacity-40"
          >
            {submitting ? t("wishes.sending") : t("wishes.submit")}
          </button>
        </div>
      </div>
      {error && (
        <p role="alert" className="text-xs text-red-400/90">
          {error}
        </p>
      )}
    </form>
  );
}
