import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/button";
import type { Database } from "@/types/database";

type Guest = Database["public"]["Tables"]["guests"]["Row"];
type GuestInsert = Database["public"]["Tables"]["guests"]["Insert"];

interface Props {
  initial?: Guest | null;
  onSubmit: (input: GuestInsert) => Promise<{ error: { message: string } | null }>;
  onCancel: () => void;
}

/**
 * Shared create/edit form. Auto-suggests slug from full_name; user can override.
 */
export function GuestForm({ initial, onSubmit, onCancel }: Props) {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState(initial?.full_name ?? "");
  const [slug, setSlug] = useState(initial?.guest_slug ?? "");
  const [phone, setPhone] = useState(initial?.phone ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [relationship, setRelationship] = useState(initial?.relationship ?? "");
  const [language, setLanguage] = useState<"vi" | "en">(initial?.language ?? "vi");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));

  // Auto-suggest slug from name (kebab, no diacritics) until user manually edits slug
  useEffect(() => {
    if (slugTouched) return;
    const auto = fullName
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[đĐ]/g, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- derived value, no async in flight
    setSlug(auto);
  }, [fullName, slugTouched]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const payload: GuestInsert = {
      guest_slug: slug,
      full_name: fullName,
      phone: phone || null,
      email: email || null,
      relationship: relationship || null,
      language,
    };
    const { error: err } = await onSubmit(payload);
    setSubmitting(false);
    if (err) setError(err.message);
  };

  const inputCls =
    "mt-1 block w-full rounded-soft border border-border-subtle bg-surface-muted px-3 py-2 text-sm text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Field label={t("admin.guests.form.fullName")}>
        <input className={inputCls} required value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </Field>
      <Field label={t("admin.guests.form.slug")}>
        <input
          className={inputCls}
          required
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(e.target.value);
          }}
        />
      </Field>
      <Field label={t("admin.guests.form.phone")}>
        <input className={inputCls} value={phone ?? ""} onChange={(e) => setPhone(e.target.value)} />
      </Field>
      <Field label={t("admin.guests.form.email")}>
        <input type="email" className={inputCls} value={email ?? ""} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label={t("admin.guests.form.relationship")}>
        <input className={inputCls} value={relationship ?? ""} onChange={(e) => setRelationship(e.target.value)} />
      </Field>
      <Field label={t("admin.guests.form.language")}>
        <select
          className={inputCls}
          value={language}
          onChange={(e) => setLanguage(e.target.value as "vi" | "en")}
        >
          <option value="vi">VI</option>
          <option value="en">EN</option>
        </select>
      </Field>

      {error && <p role="alert" className="text-xs text-red-500">{error}</p>}

      <div className="flex gap-2 pt-2">
        <Button type="submit" variant="primary" className="flex-1" disabled={submitting}>
          {submitting ? t("admin.guests.form.saving") : t("admin.guests.form.save")}
        </Button>
        <Button type="button" variant="ghost" className="flex-1" onClick={onCancel}>
          {t("admin.guests.form.cancel")}
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-widest text-on-surface-muted">{label}</span>
      {children}
    </label>
  );
}
