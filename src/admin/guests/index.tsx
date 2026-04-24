import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BottomSheet } from "@/components/common/bottom-sheet";
import { Button } from "@/components/common/button";
import { showToast } from "@/hooks/use-toast";
import { env } from "@/lib/env";
import type { Database } from "@/types/database";
import { GuestForm } from "./guest-form";
import { useGuestsAdmin } from "./use-guests-admin";

type Guest = Database["public"]["Tables"]["guests"]["Row"];

type Mode = "create" | "edit" | null;

export function GuestsModule() {
  const { t } = useTranslation();
  const { guests, loading, create, update, remove } = useGuestsAdmin();
  const [mode, setMode] = useState<Mode>(null);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter(
      (g) => g.full_name.toLowerCase().includes(q) || g.guest_slug.toLowerCase().includes(q),
    );
  }, [guests, search]);

  const inviteUrl = (slug: string) => `${env.siteUrl || window.location.origin}/?guest=${slug}`;

  const copyLink = async (g: Guest) => {
    try {
      await navigator.clipboard.writeText(inviteUrl(g.guest_slug));
      showToast(t("admin.guests.linkCopied"));
    } catch {
      showToast(t("admin.guests.copyFailed"));
    }
  };

  const copyAllCsv = () => {
    const rows = ["Name,URL", ...guests.map((g) => `"${g.full_name.replace(/"/g, '""')}","${inviteUrl(g.guest_slug)}"`)];
    const csv = "﻿" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invites-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = async (g: Guest) => {
    if (!confirm(t("admin.guests.deleteConfirm", { name: g.full_name }))) return;
    const { error } = await remove(g.id);
    if (error) showToast(t("admin.common.error"));
    else showToast(t("admin.common.deleted"));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="font-display text-xl text-on-surface">{t("admin.guests.title")}</h2>
        <span className="text-xs opacity-60">({guests.length})</span>
        <div className="ml-auto flex gap-2">
          <Button size="sm" variant="secondary" onClick={copyAllCsv}>
            {t("admin.guests.exportCsv")}
          </Button>
          <Button size="sm" variant="primary" onClick={() => { setEditing(null); setMode("create"); }}>
            {t("admin.guests.add")}
          </Button>
        </div>
      </div>

      <input
        type="search"
        placeholder={t("admin.guests.searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-soft border border-border-subtle bg-surface-muted px-3 py-2 text-sm text-on-surface"
      />

      {loading && <p className="text-sm opacity-60">{t("admin.common.loading")}</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-on-surface-muted">
            <tr>
              <th className="py-2 pr-4">{t("admin.guests.col.name")}</th>
              <th className="py-2 pr-4">{t("admin.guests.col.slug")}</th>
              <th className="py-2 pr-4">{t("admin.guests.col.lang")}</th>
              <th className="py-2 pr-4">{t("admin.guests.col.relationship")}</th>
              <th className="py-2 pr-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {filtered.map((g) => (
              <tr key={g.id} className="hover:bg-surface-muted">
                <td className="py-2 pr-4 font-medium">{g.full_name}</td>
                <td className="py-2 pr-4 text-xs opacity-70">{g.guest_slug}</td>
                <td className="py-2 pr-4 uppercase">{g.language}</td>
                <td className="py-2 pr-4 text-xs opacity-70">{g.relationship ?? "—"}</td>
                <td className="py-2 pr-4 text-right">
                  <div className="inline-flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => copyLink(g)}>
                      {t("admin.guests.copyLink")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(g); setMode("edit"); }}>
                      {t("admin.common.edit")}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => void handleDelete(g)}>
                      {t("admin.common.delete")}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BottomSheet
        open={mode !== null}
        onClose={() => setMode(null)}
        title={mode === "edit" ? t("admin.guests.editTitle") : t("admin.guests.addTitle")}
      >
        <GuestForm
          initial={editing}
          onCancel={() => setMode(null)}
          onSubmit={async (input) => {
            const result = editing
              ? await update(editing.id, input)
              : await create(input);
            if (!result.error) {
              showToast(t("admin.common.saved"));
              setMode(null);
            }
            return result;
          }}
        />
      </BottomSheet>
    </div>
  );
}
