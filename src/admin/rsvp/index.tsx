import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/common/button";
import { supabaseAdmin } from "@/lib/supabase-admin";

/* eslint-disable @typescript-eslint/no-explicit-any -- joined select not typed in hand-written DB mirror */

interface Row {
  id: string;
  status: string;
  party_size: number;
  dietary_restrictions: string | null;
  song_request: string | null;
  special_requests: string | null;
  submitted_at: string;
  guest: { full_name: string; phone: string | null; language: string } | null;
}

type Filter = "all" | "attending" | "not_attending" | "pending";

function escapeCsv(v: string | number | null | undefined): string {
  const s = v === null || v === undefined ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

export function RsvpModule() {
  const { t, i18n } = useTranslation();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { data } = await supabaseAdmin
        .from("rsvp")
        .select("id, status, party_size, dietary_restrictions, song_request, special_requests, submitted_at, guests(full_name, phone, language)")
        .order("submitted_at", { ascending: false });
      if (cancelled) return;
      setRows(
        ((data ?? []) as any[]).map((r) => ({
          id: r.id,
          status: r.status,
          party_size: r.party_size,
          dietary_restrictions: r.dietary_restrictions,
          song_request: r.song_request,
          special_requests: r.special_requests,
          submitted_at: r.submitted_at,
          guest: r.guests ? { full_name: r.guests.full_name, phone: r.guests.phone, language: r.guests.language } : null,
        })),
      );
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  const counts = useMemo(() => {
    const c = { all: rows.length, attending: 0, not_attending: 0, pending: 0 };
    rows.forEach((r) => {
      if (r.status === "attending") c.attending++;
      else if (r.status === "not_attending") c.not_attending++;
      else c.pending++;
    });
    return c;
  }, [rows]);

  const fmtDate = (iso: string) =>
    new Intl.DateTimeFormat(i18n.language, { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Saigon" }).format(new Date(iso));

  const exportCsv = () => {
    const header = ["Name", "Phone", "Status", "Party", "Dietary", "Song", "Special requests", "Submitted"];
    const lines = filtered.map((r) =>
      [
        r.guest?.full_name ?? "",
        r.guest?.phone ?? "",
        r.status,
        r.party_size,
        r.dietary_restrictions,
        r.song_request,
        r.special_requests,
        fmtDate(r.submitted_at),
      ].map(escapeCsv).join(","),
    );
    const csv = "﻿" + [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rsvp-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const FILTERS: Filter[] = ["all", "attending", "not_attending", "pending"];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-xl text-on-surface">{t("admin.rsvp.title")}</h2>
        <div className="ml-auto">
          <Button size="sm" variant="primary" onClick={exportCsv}>
            {t("admin.rsvp.exportCsv")}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`min-h-[32px] rounded-pill px-3 py-1 text-xs uppercase tracking-widest transition ${
              filter === f ? "bg-accent text-on-accent" : "border border-border-subtle text-on-surface hover:bg-surface-muted"
            }`}
          >
            {t(`admin.rsvp.filter.${f}`)} ({counts[f]})
          </button>
        ))}
      </div>

      {loading && <p className="text-sm opacity-60">{t("admin.common.loading")}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-on-surface-muted">
            <tr>
              <th className="py-2 pr-4">{t("admin.rsvp.col.name")}</th>
              <th className="py-2 pr-4">{t("admin.rsvp.col.status")}</th>
              <th className="py-2 pr-4">{t("admin.rsvp.col.party")}</th>
              <th className="py-2 pr-4">{t("admin.rsvp.col.dietary")}</th>
              <th className="py-2 pr-4">{t("admin.rsvp.col.song")}</th>
              <th className="py-2 pr-4">{t("admin.rsvp.col.submitted")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-surface-muted">
                <td className="py-2 pr-4 font-medium">{r.guest?.full_name ?? "—"}</td>
                <td className="py-2 pr-4 text-xs">{r.status}</td>
                <td className="py-2 pr-4">{r.party_size}</td>
                <td className="py-2 pr-4 text-xs opacity-70 truncate max-w-[120px]">{r.dietary_restrictions ?? "—"}</td>
                <td className="py-2 pr-4 text-xs opacity-70 truncate max-w-[160px]">{r.song_request ?? "—"}</td>
                <td className="py-2 pr-4 text-xs opacity-70">{fmtDate(r.submitted_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
