import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";

interface SeatSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatMap: any; // SeatMapJson from seating
}

export function SeatSearchModal({ isOpen, onClose, seatMap }: SeatSearchModalProps) {
  const [guests, setGuests] = useState<Database["public"]["Tables"]["guests"]["Row"][]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<(typeof guests)[0] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const fetchGuests = async () => {
      // Fetch guests with confirmed RSVP status
      const { data, error } = await supabase
        .from("guests")
        .select("*, rsvp:rsvp(status)")
        .order("full_name", { ascending: true });
      
      if (!error && data) {
        // Filter for confirmed RSVPs only
        const confirmedGuests = (data as any[]).filter(
          (g) => g.rsvp && Array.isArray(g.rsvp) && g.rsvp.some((r: any) => r.status === "attending")
        );
        setGuests(confirmedGuests);
      }
      setLoading(false);
    };
    fetchGuests();
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return guests;
    const q = searchQuery.toLowerCase();
    return guests.filter((g) => g.full_name.toLowerCase().includes(q) || g.guest_slug?.toLowerCase().includes(q));
  }, [guests, searchQuery]);

  const selectedGuestTableAssignment = useMemo(() => {
    if (!selectedGuest || !seatMap) return null;
    for (const [tableId, guestIds] of Object.entries(seatMap.assignments || {})) {
      if ((guestIds as string[]).includes(selectedGuest.id)) {
        const table = seatMap.tables?.find((t: any) => t.id === tableId);
        return { tableId, table };
      }
    }
    return null;
  }, [selectedGuest, seatMap]);

  if (!isOpen) return null;

  const buildSvgMap = () => {
    if (!seatMap?.tables) return "";
    const width = 1000;
    const height = 640;
    const tableShapes = seatMap.tables
      .map((table: any) => {
        const fill = table.shape === "round" ? "#FEE2E2" : "#EDE9FE";
        const stroke = table.shape === "round" ? "#DC2626" : "#7C3AED";
        const shape =
          table.shape === "rectangle"
            ? `<rect x="${table.x}" y="${table.y}" width="${table.width}" height="${table.height}" rx="18" />`
            : table.shape === "oval"
            ? `<ellipse cx="${table.x + table.width / 2}" cy="${table.y + table.height / 2}" rx="${table.width / 2}" ry="${table.height / 2}" />`
            : `<circle cx="${table.x + table.width / 2}" cy="${table.y + table.height / 2}" r="${Math.min(table.width, table.height) / 2}" />`;

        const isSelected = selectedGuestTableAssignment?.tableId === table.id;
        return `
          <g>
            <g fill="${isSelected ? "#10B981" : fill}" stroke="${isSelected ? "#059669" : stroke}" stroke-width="2">${shape}</g>
            <text x="${table.x + table.width / 2}" y="${table.y + table.height / 2 + 6}" text-anchor="middle" font-size="16" fill="#111">${table.name}</text>
          </g>`;
      })
      .join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="100%" height="100%" fill="#fff" />
        ${tableShapes}
      </svg>`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="relative h-[90vh] w-[95vw] max-w-7xl rounded-3xl bg-white overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
          <h2 className="font-display text-2xl">Tìm kiếm vị trí bàn tiệc</h2>
          <button onClick={onClose} className="text-2xl leading-none opacity-50 hover:opacity-100">
            ✕
          </button>
        </div>

        {/* Main content grid */}
        <div className="flex-1 overflow-hidden flex gap-4 p-6">
          {/* Left: Search */}
          <div className="w-80 flex flex-col gap-4 border-r border-border-subtle pr-4 overflow-y-auto">
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-on-surface-muted mb-2">Nhập tên của bạn</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full rounded-2xl border border-border-subtle px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Search results */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-muted mb-2">Kết quả ({searchResults.length})</p>
              <div className="space-y-2">
                {loading ? (
                  <p className="text-sm opacity-60">Đang tải...</p>
                ) : searchResults.length === 0 ? (
                  <p className="text-sm opacity-60">Không tìm thấy khách nào</p>
                ) : (
                  searchResults.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => setSelectedGuest(guest)}
                      className={`w-full text-left rounded-2xl px-4 py-3 text-sm transition ${
                        selectedGuest?.id === guest.id
                          ? "bg-accent text-white"
                          : "bg-surface hover:bg-surface-muted border border-border-subtle"
                      }`}
                    >
                      <p className="font-medium">{guest.full_name}</p>
                      <p className="text-xs opacity-70">{guest.relationship ?? "Khách"}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Center: SeatMap */}
          <div className="flex-1 flex flex-col">
            <p className="text-xs uppercase tracking-[0.3em] text-on-surface-muted mb-2">Sơ đồ bàn tiệc</p>
            <div className="flex-1 rounded-2xl border border-border-subtle flex items-center justify-center bg-white overflow-hidden">
              {seatMap?.tables ? (
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildSvgMap())}`}
                  alt="Seat map"
                  className="max-w-full max-h-full object-contain p-4"
                />
              ) : (
                <div className="flex items-center justify-center h-full opacity-60">Không có sơ đồ</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer: Guest info + assigned table */}
        {selectedGuest && selectedGuestTableAssignment && (
          <div className="border-t border-border-subtle bg-surface-muted px-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-on-surface-muted mb-1">Khách</p>
                <p className="text-sm font-medium">{selectedGuest.full_name}</p>
                <p className="text-xs opacity-60">{selectedGuest.relationship ?? "Khách"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-on-surface-muted mb-1">Ngôn ngữ</p>
                <p className="text-sm font-medium">{selectedGuest.language === "vi" ? "Tiếng Việt" : "English"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-on-surface-muted mb-1">Vị trí bàn</p>
                <p className="text-sm font-medium text-accent">{selectedGuestTableAssignment.table?.name || "Chưa xác định"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
