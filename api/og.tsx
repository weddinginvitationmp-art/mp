import React from "react";
import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

const BG_URL =
  "https://images.unsplash.com/photo-1525258801-c69ea2d57749?w=1920&q=70";

/**
 * Fetch guest full_name by slug. Uses service role if available for bypassing RLS;
 * otherwise anon key (guests.full_name is readable under RLS select policy).
 */
async function fetchGuestName(slug: string | null): Promise<string | null> {
  if (!slug || !SUPABASE_URL) return null;
  const key = SERVICE_ROLE ?? SUPABASE_ANON;
  if (!key) return null;
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/guests?guest_slug=eq.${encodeURIComponent(slug)}&select=full_name`,
      {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      },
    );
    const rows = (await res.json()) as Array<{ full_name: string }>;
    return rows[0]?.full_name ?? null;
  } catch {
    return null;
  }
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("guest");
  const lang = searchParams.get("lang")?.startsWith("en") ? "en" : "vi";

  const guestName = await fetchGuestName(slug);
  const couple = "Hà Phương & Hoàng Minh";
  const dateLabel = lang === "vi" ? "12 tháng 12 · 2026" : "December 12, 2026";
  const invitee = guestName
    ? lang === "vi"
      ? `Kính mời ${guestName}`
      : `Dearly invited, ${guestName}`
    : lang === "vi"
      ? "Trân trọng kính mời"
      : "Save the date";

  return new ImageResponse(
    React.createElement(
      "div",
      {
        style: {
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: `linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.75) 100%), url(${BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#F7E7CE",
          fontFamily: "great-vibes, serif",
          padding: 80,
          textAlign: "center",
        },
      },
      React.createElement(
        "div",
        {
          style: {
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            opacity: 0.7,
            marginBottom: 28,
          },
        },
        invitee,
      ),
      React.createElement(
        "div",
        { style: { fontSize: 96, lineHeight: 1.1, fontWeight: 400, marginBottom: 24 } },
        couple,
      ),
      React.createElement("div", {
        style: { width: 120, height: 1, background: "#C9A876", opacity: 0.7, marginBottom: 24 },
      }),
      React.createElement(
        "div",
        { style: { fontSize: 28, letterSpacing: 4, opacity: 0.85 } },
        dateLabel,
      ),
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    },
  );
}
