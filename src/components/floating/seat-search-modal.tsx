import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/types/database";
import type { SeatMapWithId } from "@/hooks/use-seat-map";
import { Tab, TabList, TabPanel, Tabs } from "@/components/common/tabs";

interface SeatSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  seatMap: any; // SeatMapJson from seating
  allMaps: SeatMapWithId[];
  selectedMapId?: string;
  onSelectMap: (mapId: string) => void;
}

export function SeatSearchModal({ isOpen, onClose, seatMap, allMaps, selectedMapId, onSelectMap }: SeatSearchModalProps) {
  const [guests, setGuests] = useState<Database["public"]["Tables"]["guests"]["Row"][]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<(typeof guests)[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileTab, setMobileTab] = useState("search");

  useEffect(() => {
    if (!isOpen) return;
    const fetchGuests = async () => {
      // Fetch all guests
      const { data: allGuests, error: guestError } = await supabase
        .from("guests")
        .select("*")
        .order("full_name", { ascending: true });
      
      if (guestError || !allGuests) {
        setLoading(false);
        return;
      }

      // Filter to only guests who are assigned to a table
      const assignedGuestIds = new Set(
        Object.values(seatMap?.assignments || {})
          .flat()
          .filter(id => typeof id === 'string')
      );
      
      const assignedGuests = (allGuests as Database["public"]["Tables"]["guests"]["Row"][]).filter(g => assignedGuestIds.has(g.id));
      
      setGuests(assignedGuests);
      setLoading(false);
    };
    fetchGuests();
  }, [isOpen, seatMap]);

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

  useEffect(() => {
    if (isOpen) {
      setMobileTab("search");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const buildSvgMap = () => {
    if (!seatMap?.tables) return "";
    const width = 1000;
    const height = 640;

    // Build stage
    const stage = seatMap.stage
      ? `<rect x="${seatMap.stage.x}" y="${seatMap.stage.y}" width="${seatMap.stage.width}" height="${seatMap.stage.height}" fill="#DBEAFE" stroke="#3B82F6" stroke-width="2" rx="12" />
         <text x="${seatMap.stage.x + seatMap.stage.width / 2}" y="${seatMap.stage.y + seatMap.stage.height / 2 + 6}" text-anchor="middle" font-size="20" font-family="Arial, sans-serif" fill="#1E40AF">Stage</text>`
      : "";

    // Build zones
    const zones = seatMap.zones
      .map(
        (zone: any) => `
        <rect x="${zone.x}" y="${zone.y}" width="${zone.width}" height="${zone.height}" fill="${zone.color}" fill-opacity="0.35" stroke="#D97706" stroke-width="2" rx="14" />
        <text x="${zone.x + 12}" y="${zone.y + 24}" font-size="16" font-family="Arial, sans-serif" fill="#92400E">${zone.name}</text>`,
      )
      .join("");

    // Build tables
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
        <defs>
          <style>text { font-family: Arial, "Segoe UI", sans-serif; }</style>
        </defs>
        <rect width="100%" height="100%" fill="#fff" />
        ${zones}
        ${stage}
        ${tableShapes}
      </svg>`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4" onClick={onClose}>
      <div className="relative flex h-[92dvh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:h-[90vh] sm:w-[95vw]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="border-b border-gray-200 px-4 py-4 sm:px-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <h2 className="font-display text-xl text-gray-900 sm:text-2xl">Tìm kiếm vị trí bàn tiệc</h2>
            <button onClick={onClose} className="text-2xl leading-none text-gray-600 hover:text-gray-900">
              ✕
            </button>
          </div>
          
          {/* Seat map selector dropdown */}
          {allMaps.length > 1 && (
            <div>
              <label className="block text-xs uppercase tracking-[0.3em] text-gray-600 mb-2">Chọn sơ đồ</label>
              <select
                value={selectedMapId || ""}
                onChange={(e) => onSelectMap(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {allMaps.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden p-4 sm:p-6">
          <div className="lg:hidden">
            <Tabs value={mobileTab} onChange={setMobileTab} label="Seat map tabs" className="space-y-4">
              <TabList label="Seat map tabs" >
                <Tab value="search">Nhập tên</Tab>
                <Tab value="map">Xem map</Tab>
              </TabList>

              <TabPanel value="search">
                <div className="space-y-4 overflow-y-auto pb-1">
                  <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-600">Nhập tên của bạn</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Tìm kiếm..."
                      className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {searchQuery.trim().length > 0 && (
                    <div>
                      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gray-600">Kết quả ({searchResults.length})</p>
                      <div className="max-h-[38vh] space-y-2 overflow-y-auto pr-1">
                        {loading ? (
                          <p className="text-sm text-gray-500">Đang tải...</p>
                        ) : searchResults.length === 0 ? (
                          <p className="text-sm text-gray-500">Không tìm thấy khách nào</p>
                        ) : (
                          searchResults.map((guest) => (
                            <button
                              key={guest.id}
                              onClick={() => setSelectedGuest(guest)}
                              className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                                selectedGuest?.id === guest.id
                                  ? "border-red-500 bg-red-500 text-white"
                                  : "border-gray-300 bg-gray-100 text-gray-900 hover:bg-gray-200"
                              }`}
                            >
                              <p className="font-medium">{guest.full_name}</p>
                              <p className="text-xs opacity-70">{guest.relationship ?? "Khách"}</p>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </TabPanel>

              <TabPanel value="map">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-600">Sơ đồ bàn tiệc</p>
                  <div className="flex min-h-[48vh] items-center justify-center overflow-hidden rounded-2xl border border-gray-300 bg-white">
                    {seatMap?.tables ? (
                      <img
                        src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildSvgMap())}`}
                        alt="Seat map"
                        className="h-full max-h-[48vh] w-full max-w-full object-contain p-2 sm:p-4"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">Không có sơ đồ</div>
                    )}
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>

          <div className="hidden flex-1 flex-col gap-4 overflow-hidden lg:flex lg:flex-row">
            <div className="w-80 flex-none border-r border-gray-200 pr-4">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.3em] text-gray-600">Nhập tên của bạn</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                {searchQuery.trim().length > 0 && (
                  <div>
                    <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gray-600">Kết quả ({searchResults.length})</p>
                    <div className="space-y-2 overflow-y-auto pr-1">
                      {loading ? (
                        <p className="text-sm text-gray-500">Đang tải...</p>
                      ) : searchResults.length === 0 ? (
                        <p className="text-sm text-gray-500">Không tìm thấy khách nào</p>
                      ) : (
                        searchResults.map((guest) => (
                          <button
                            key={guest.id}
                            onClick={() => setSelectedGuest(guest)}
                            className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                              selectedGuest?.id === guest.id
                                ? "border-red-500 bg-red-500 text-white"
                                : "border-gray-300 bg-gray-100 text-gray-900 hover:bg-gray-200"
                            }`}
                          >
                            <p className="font-medium">{guest.full_name}</p>
                            <p className="text-xs opacity-70">{guest.relationship ?? "Khách"}</p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-gray-600">Sơ đồ bàn tiệc</p>
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-gray-300 bg-white">
                {seatMap?.tables ? (
                  <img
                    src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildSvgMap())}`}
                    alt="Seat map"
                    className="h-full max-h-full w-full max-w-full object-contain p-4"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">Không có sơ đồ</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Guest info + assigned table */}
        {selectedGuest && selectedGuestTableAssignment && (
          <div className="border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-600 mb-1">Khách</p>
                <p className="text-sm font-medium text-gray-900">{selectedGuest.full_name}</p>
                <p className="text-xs text-gray-600">{selectedGuest.relationship ?? "Khách"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gray-600 mb-1">Vị trí bàn</p>
                <p className="text-sm font-medium text-red-500">{selectedGuestTableAssignment.table?.name || "Chưa xác định"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
