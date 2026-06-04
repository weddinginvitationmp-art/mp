import { useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { BottomSheet } from "@/components/common/bottom-sheet";
import { Button } from "@/components/common/button";
import { showToast } from "@/hooks/use-toast";
import { env } from "@/lib/env";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Database } from "@/types/database";
import { GuestForm } from "./guest-form";
import { useGuestsAdmin } from "./use-guests-admin";

type Guest = Database["public"]["Tables"]["guests"]["Row"];

type Mode = "create" | "edit" | null;

export function GuestsModule() {
  const { t, i18n } = useTranslation();
  const { guests, loading, create, update, remove, refetch } = useGuestsAdmin();
  const [mode, setMode] = useState<Mode>(null);
  const [editing, setEditing] = useState<Guest | null>(null);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lang = i18n.language.startsWith("vi") ? "vi" : "en";

  const handleImportCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be uploaded again
    e.target.value = "";

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      try {
        const rows = parseCSV(text);
        if (rows.length === 0) {
          showToast(lang === "vi" ? "File CSV trống!" : "CSV file is empty!");
          return;
        }

        const payload = rows
          .map(mapCsvRowToGuest)
          .filter((g): g is NonNullable<ReturnType<typeof mapCsvRowToGuest>> => g !== null);

        if (payload.length === 0) {
          showToast(lang === "vi" ? "Không tìm thấy dữ liệu khách mời hợp lệ!" : "No valid guest data found!");
          return;
        }

        const { error } = await supabaseAdmin.from("guests").insert(payload as any);
        if (error) {
          showToast(t("admin.guests.importFailed", { error: error.message }) || `Lỗi: ${error.message}`);
        } else {
          await refetch();
          showToast(t("admin.guests.importSuccess", { count: payload.length }) || `Đã nhập thành công ${payload.length} khách mời!`);
        }
      } catch (err: any) {
        showToast(`Lỗi: ${err.message || err}`);
      }
    };
    reader.readAsText(file, "UTF-8");
  };

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
        <div className="ml-auto flex flex-wrap gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleImportCsv}
            ref={fileInputRef}
            className="hidden"
          />
          <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
            {t("admin.guests.importCsv") || "Nhập CSV"}
          </Button>
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

function parseCSV(text: string) {
  const lines = text.split(/\r?\n/);
  if (lines.length === 0) return [];

  let delimiter = ",";
  const firstLine = lines[0];
  if (firstLine && firstLine.includes(";")) {
    delimiter = ";";
  }


  const parseLine = (line: string) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseLine(lines[0] ?? "");
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = (lines[i] ?? "").trim();
    if (!line) continue;
    const values = parseLine(line);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header.toLowerCase()] = values[index] || "";
    });
    rows.push(row);
  }
  return rows;
}

function mapCsvRowToGuest(row: Record<string, string>) {
  let fullName = "";
  let slug = "";
  let phone: string | null = null;
  let email: string | null = null;
  let relationship: string | null = null;
  let language: "vi" | "en" = "vi";

  for (const [key, value] of Object.entries(row)) {
    const val = value.trim();
    if (!val) continue;

    if (/name|họ tên|ho ten|họ và tên|ho va ten|fullname|khách mời|khach moi/i.test(key)) {
      fullName = val;
    } else if (/slug|url|đường dẫn|duong dan/i.test(key)) {
      slug = val;
    } else if (/phone|sđt|sdt|điện thoại|dien thoai|tel/i.test(key)) {
      phone = val;
    } else if (/email|mail/i.test(key)) {
      email = val;
    } else if (/relationship|quan hệ|quan he|mối quan hệ|moi quan he/i.test(key)) {
      relationship = val;
    } else if (/language|ngôn ngữ|ngon ngu|lang/i.test(key)) {
      language = val.toLowerCase().includes("en") ? "en" : "vi";
    }
  }

  if (!fullName) return null;

  if (!slug) {
    slug = fullName
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[đĐ]/g, "d")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  return {
    full_name: fullName,
    guest_slug: slug,
    phone: phone || null,
    email: email || null,
    relationship: relationship || null,
    language,
  };
}
