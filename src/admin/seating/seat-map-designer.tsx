import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/common/button";
import type { Database } from "@/types/database";
import type { SeatMapAssignments, SeatMapJson, SeatTable, ZoneShape } from "./types";

interface SeatMapDesignerProps {
  seatMap: SeatMapJson;
  guests: Database["public"]["Tables"]["guests"]["Row"][];
  onChange: (map: SeatMapJson) => void;
  onSave: () => Promise<void>;
  onClose: () => void;
  onImportImage: (file: File) => void;
  saving: boolean;
}

const GRID_SIZE = 20;

function buildSvg(seatMap: SeatMapJson): string {
  const width = 1000;
  const height = 640;
  const background = `#fff`;
  const stage = seatMap.stage
    ? `<rect x="${seatMap.stage.x}" y="${seatMap.stage.y}" width="${seatMap.stage.width}" height="${seatMap.stage.height}" fill="#DBEAFE" stroke="#3B82F6" stroke-width="2" rx="12" />
       <text x="${seatMap.stage.x + seatMap.stage.width / 2}" y="${seatMap.stage.y + seatMap.stage.height / 2 + 6}" text-anchor="middle" font-size="20" font-family="Arial, sans-serif" fill="#1E40AF">Stage</text>`
    : "";

  const zones = seatMap.zones
    .map(
      (zone) => `
      <rect x="${zone.x}" y="${zone.y}" width="${zone.width}" height="${zone.height}" fill="${zone.color}" fill-opacity="0.35" stroke="#D97706" stroke-width="2" rx="14" />
      <text x="${zone.x + 12}" y="${zone.y + 24}" font-size="16" font-family="Arial, sans-serif" fill="#92400E">${zone.name}</text>`,
    )
    .join("");

  const tableShapes = seatMap.tables
    .map((table) => {
      const fill = table.shape === "round" ? "#FEE2E2" : "#EDE9FE";
      const stroke = table.shape === "round" ? "#DC2626" : "#7C3AED";
      const shape =
        table.shape === "rectangle"
          ? `<rect x="${table.x}" y="${table.y}" width="${table.width}" height="${table.height}" rx="18" />`
          : table.shape === "oval"
          ? `<ellipse cx="${table.x + table.width / 2}" cy="${table.y + table.height / 2}" rx="${table.width / 2}" ry="${table.height / 2}" />`
          : `<circle cx="${table.x + table.width / 2}" cy="${table.y + table.height / 2}" r="${Math.min(table.width, table.height) / 2}" />`;

      return `
        <g>
          <g fill="${fill}" stroke="${stroke}" stroke-width="2">${shape}</g>
          <text x="${table.x + table.width / 2}" y="${table.y + table.height / 2 + 6}" text-anchor="middle" font-size="16" font-family="Arial, sans-serif" fill="#111">${table.name}</text>
          <text x="${table.x + table.width / 2}" y="${table.y + table.height / 2 + 28}" text-anchor="middle" font-size="12" font-family="Arial, sans-serif" fill="#4B5563">${(seatMap.assignments[table.id] ?? []).length}/${table.capacity}</text>
        </g>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <style>text { font-family: Arial, "Segoe UI", sans-serif; }</style>
      </defs>
      <rect width="100%" height="100%" fill="${background}" />
      ${zones}
      ${stage}
      ${tableShapes}
    </svg>`;
}

function downloadFile(content: string | Blob, fileName: string, mimeType: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

function getAssignedGuestIds(assignments: SeatMapAssignments) {
  return Object.values(assignments).flat();
}

export function SeatMapDesigner({ seatMap, guests, onChange, onSave, onClose, onImportImage, saving }: SeatMapDesignerProps) {
  const [selectedTableId, setSelectedTableId] = useState<string | null>(seatMap.tables[0]?.id ?? null);
  const [selectedRegion, setSelectedRegion] = useState<{ kind: "table" | "zone" | "stage"; id?: string } | null>(
    seatMap.tables[0]?.id ? { kind: "table", id: seatMap.tables[0].id } : null,
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{ kind: "table" | "zone" | "stage"; id?: string; startX: number; startY: number; startObjX: number; startObjY: number } | null>(null);
  const [resizing, setResizing] = useState<{ kind: "table" | "zone" | "stage"; id?: string; startX: number; startY: number; startWidth: number; startHeight: number } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (seatMap.tables.length > 0 && !seatMap.tables.some((table) => table.id === selectedTableId)) {
      setSelectedTableId(seatMap.tables[0]?.id ?? null);
    }
  }, [seatMap.tables, selectedTableId]);

  const selectedTable = seatMap.tables.find((table) => table.id === selectedTableId) ?? null;
  const assignedGuestIds = useMemo(() => getAssignedGuestIds(seatMap.assignments), [seatMap.assignments]);
  const unassignedGuests = guests.filter((guest) => !assignedGuestIds.includes(guest.id));
  const selectedTableAssigned = selectedTable ? seatMap.assignments[selectedTable.id] ?? [] : [];

  const updateMap = (changes: Partial<SeatMapJson>) => {
    onChange({ ...seatMap, ...changes });
  };

  const moveTable = (x: number, y: number) => {
    if (!selectedTable) return;
    const tableIndex = seatMap.tables.findIndex((table) => table.id === selectedTable.id);
    if (tableIndex < 0) return;
    const updatedTables = [...seatMap.tables];
    updatedTables[tableIndex] = { ...selectedTable, x, y };
    updateMap({ tables: updatedTables });
  };

  const moveZone = (zoneId: string, x: number, y: number) => {
    const idx = seatMap.zones.findIndex((z) => z.id === zoneId);
    if (idx < 0) return;
    const updated = [...seatMap.zones];
    const z = updated[idx]!;
    updated[idx] = { ...z, x, y };
    updateMap({ zones: updated });
  };

  const moveStage = (x: number, y: number) => {
    if (!seatMap.stage) return;
    updateMap({ stage: { ...seatMap.stage, x, y } });
  };

  const resizeTable = (width: number, height: number) => {
    if (!selectedTable) return;
    const tableIndex = seatMap.tables.findIndex((table) => table.id === selectedTable.id);
    if (tableIndex < 0) return;
    const updatedTables = [...seatMap.tables];
    updatedTables[tableIndex] = { ...selectedTable, width: Math.max(40, width), height: Math.max(40, height) };
    const newWidth = Math.max(40, width);
    const newHeight = Math.max(40, height);
    updatedTables[tableIndex] = { ...selectedTable, width: newWidth, height: newHeight };
    updateMap({
      tables: updatedTables,
      defaultTableWidth: newWidth,
      defaultTableHeight: newHeight,
    });
  };

  const resizeZone = (zoneId: string, width: number, height: number) => {
    const idx = seatMap.zones.findIndex((z) => z.id === zoneId);
    if (idx < 0) return;
    const updated = [...seatMap.zones];
    updated[idx] = { ...updated[idx]!, width: Math.max(60, width), height: Math.max(60, height) };
    updateMap({ zones: updated });
  };

  const resizeStage = (width: number, height: number) => {
    if (!seatMap.stage) return;
    updateMap({ stage: { ...seatMap.stage, width: Math.max(60, width), height: Math.max(40, height) } });
  };

  const setSelectedTableName = (name: string) => {
    if (!selectedTable) return;
    const updated = seatMap.tables.map((table) =>
      table.id === selectedTable.id ? { ...table, name } : table,
    );
    updateMap({ tables: updated });
  };

  const setSelectedTableCapacity = (capacity: number) => {
    if (!selectedTable) return;
    const updated = seatMap.tables.map((table) =>
      table.id === selectedTable.id ? { ...table, capacity } : table,
    );
    updateMap({ tables: updated });
  };

  const addTable = () => {
    const nextIndex = seatMap.tables.length + 1;
    const newTable: SeatTable = {
      id: `table-${crypto.randomUUID()}`,
      name: `Table ${nextIndex}`,
      shape: "round",
      capacity: 8,
      x: 80 + nextIndex * 30,
      y: 80 + nextIndex * 30,
      width: seatMap.defaultTableWidth ?? 140,
      height: seatMap.defaultTableHeight ?? 140,
    };
    updateMap({ tables: [...seatMap.tables, newTable] });
    setSelectedTableId(newTable.id);
  };

  const toggleStage = () => {
    if (seatMap.stage) {
      updateMap({ stage: undefined });
      return;
    }
    updateMap({
      stage: {
        id: "stage-1",
        x: 70,
        y: 460,
        width: 360,
        height: 100,
      },
    });
  };

  const addZone = () => {
    const nextIndex = seatMap.zones.length + 1;
    const zone: ZoneShape = {
      id: `zone-${crypto.randomUUID()}`,
      name: `Zone ${nextIndex}`,
      color: "#C7D2FE",
      x: 520,
      y: 100 + nextIndex * 80,
      width: 260,
      height: 140,
    };
    updateMap({ zones: [...seatMap.zones, zone] });
  };

  const assignGuest = (guestId: string) => {
    if (!selectedTable) return;
    const assignments = { ...seatMap.assignments };
    const current = new Set(assignments[selectedTable.id] ?? []);
    if (current.has(guestId)) return;
    if (current.size >= selectedTable.capacity) return;
    current.add(guestId);
    assignments[selectedTable.id] = Array.from(current);
    updateMap({ assignments });
  };

  const unassignGuest = (guestId: string) => {
    const assignments = { ...seatMap.assignments };
    Object.keys(assignments).forEach((tableId) => {
      if (!assignments[tableId]) return;
      assignments[tableId] = assignments[tableId].filter((id) => id !== guestId);
      if (assignments[tableId].length === 0) {
        delete assignments[tableId];
      }
    });
    updateMap({ assignments });
  };

  const handleCanvasMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedRegion || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;

    if (selectedRegion.kind === "table" && selectedTable) {
      setDragging({
        kind: "table",
        id: selectedTable.id,
        startX,
        startY,
        startObjX: selectedTable.x,
        startObjY: selectedTable.y,
      });
      return;
    }

    if (selectedRegion.kind === "zone" && selectedRegion.id) {
      const zone = seatMap.zones.find((z) => z.id === selectedRegion.id);
      if (!zone) return;
      setDragging({
        kind: "zone",
        id: zone.id,
        startX,
        startY,
        startObjX: zone.x,
        startObjY: zone.y,
      });
      return;
    }

    if (selectedRegion.kind === "stage" && seatMap.stage) {
      setDragging({
        kind: "stage",
        startX,
        startY,
        startObjX: seatMap.stage.x,
        startObjY: seatMap.stage.y,
      });
      return;
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    // Handle resizing
    if (resizing && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const currentX = event.clientX - rect.left;
      const currentY = event.clientY - rect.top;
      const deltaX = currentX - resizing.startX;
      const deltaY = currentY - resizing.startY;

      const newWidth = resizing.startWidth + deltaX;
      const newHeight = resizing.startHeight + deltaY;

      if (resizing.kind === "table" && resizing.id) {
        resizeTable(newWidth, newHeight);
      } else if (resizing.kind === "zone" && resizing.id) {
        resizeZone(resizing.id, newWidth, newHeight);
      } else if (resizing.kind === "stage") {
        resizeStage(newWidth, newHeight);
      }
      return;
    }

    // Handle dragging
    if (!dragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;
    const deltaX = currentX - dragging.startX;
    const deltaY = currentY - dragging.startY;

    const newX = Math.round((dragging.startObjX + deltaX) / GRID_SIZE) * GRID_SIZE;
    const newY = Math.round((dragging.startObjY + deltaY) / GRID_SIZE) * GRID_SIZE;

    if (dragging.kind === "table" && dragging.id) {
      moveTable(Math.max(0, newX), Math.max(0, newY));
    } else if (dragging.kind === "zone" && dragging.id) {
      moveZone(dragging.id, Math.max(0, newX), Math.max(0, newY));
    } else if (dragging.kind === "stage") {
      moveStage(Math.max(0, newX), Math.max(0, newY));
    }
  };

  const handleCanvasMouseUp = () => {
    setDragging(null);
    setResizing(null);
  };

  const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>, kind: "table" | "zone" | "stage", id?: string) => {
    event.stopPropagation();
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const startX = event.clientX - rect.left;
    const startY = event.clientY - rect.top;

    if (kind === "table" && selectedTable) {
      setResizing({ kind: "table", id: selectedTable.id, startX, startY, startWidth: selectedTable.width, startHeight: selectedTable.height });
    } else if (kind === "zone" && id) {
      const zone = seatMap.zones.find((z) => z.id === id);
      if (zone) {
        setResizing({ kind: "zone", id, startX, startY, startWidth: zone.width, startHeight: zone.height });
      }
    } else if (kind === "stage" && seatMap.stage) {
      setResizing({ kind: "stage", startX, startY, startWidth: seatMap.stage.width, startHeight: seatMap.stage.height });
    }
  };

  const exportPng = async () => {
    const svg = buildSvg(seatMap);
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1000;
      canvas.height = 640;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0);
      canvas.toBlob((canvasBlob) => {
        if (canvasBlob) {
          downloadFile(canvasBlob, `${seatMap.name.replace(/\W+/g, "_") || "seat-map"}.png`, "image/png");
        }
      });
      URL.revokeObjectURL(url);
    };
    image.src = url;
  };

  const exportExcel = () => {
    const header = ["Table", "Guest Name", "Guest Language", "Relationship"];
    const lines = [header.join(",")];
    Object.entries(seatMap.assignments).forEach(([tableId, ids]) => {
      const table = seatMap.tables.find((item) => item.id === tableId);
      ids.forEach((guestId) => {
        const guest = guests.find((item) => item.id === guestId);
        lines.push(
          [
            table?.name ?? "Unknown",
            guest?.full_name ?? "Unknown",
            guest?.language ?? "vi",
            guest?.relationship ?? "",
          ]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(","),
        );
      });
    });
    // Add UTF-8 BOM for proper Vietnamese character encoding in Excel
    const csvWithBOM = "\uFEFF" + lines.join("\n");
    downloadFile(csvWithBOM, `${seatMap.name.replace(/\W+/g, "_") || "seat-map"}.csv`, "text/csv;charset=utf-8");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    onImportImage(file);
    event.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="sm" variant="secondary" onClick={onClose}>
          Quay lại
        </Button>
        <div className="min-w-[240px] flex-1">
          <label className="block text-xs uppercase tracking-[0.3em] text-on-surface-muted">Tên sơ đồ</label>
          <input
            value={seatMap.name}
            onChange={(event) => onChange({ ...seatMap, name: event.target.value })}
            className="mt-2 w-full rounded-soft border border-border-subtle bg-surface px-3 py-2 text-sm text-on-surface"
          />
        </div>
        <Button size="sm" variant="secondary" onClick={addTable}>
          Thêm bàn
        </Button>
        <Button size="sm" variant="secondary" onClick={toggleStage}>
          {seatMap.stage ? "Xóa sân khấu" : "Thêm sân khấu"}
        </Button>
        <Button size="sm" variant="secondary" onClick={addZone}>
          Thêm vùng
        </Button>
        <Button size="sm" variant="primary" onClick={onSave} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu sơ đồ"}
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <section className="space-y-4 rounded-3xl border border-border-subtle bg-surface-muted p-4">
          <div className="space-y-3">
            <p className="text-sm font-medium">Công cụ sơ đồ</p>
            <div className="space-y-2">
              <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Nhập ảnh PNG/JPG
              </Button>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" hidden onChange={handleImport} />
              {imagePreview ? <img src={imagePreview} alt="Xem trước ảnh đã nhập" className="h-36 w-full rounded-2xl object-cover" /> : null}
              <Button size="sm" variant="secondary" onClick={exportPng}>
                Xuất PNG
              </Button>
              <Button size="sm" variant="secondary" onClick={exportExcel}>
                Xuất Excel
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Bàn đã chọn</p>
            {!selectedTable ? (
              <p className="text-sm opacity-70">Chọn bàn trên sơ đồ để chỉnh sửa.</p>
            ) : (
              <div className="space-y-3 rounded-3xl border border-border-subtle bg-surface p-3">
                <label className="block text-xs uppercase tracking-[0.3em] text-on-surface-muted">Tên bàn</label>
                <input
                  value={selectedTable.name}
                  onChange={(event) => setSelectedTableName(event.target.value)}
                  className="w-full rounded-soft border border-border-subtle px-3 py-2 text-sm"
                />
                <label className="block text-xs uppercase tracking-[0.3em] text-on-surface-muted">Sức chứa</label>
                <input
                  type="number"
                  min={1}
                  value={selectedTable.capacity}
                  onChange={(event) => setSelectedTableCapacity(Number(event.target.value) || 1)}
                  className="w-full rounded-soft border border-border-subtle px-3 py-2 text-sm"
                />
                <Button size="sm" variant="ghost" onClick={() => {
                  const updatedTables = seatMap.tables.filter((table) => table.id !== selectedTable.id);
                  const assignments = { ...seatMap.assignments };
                  delete assignments[selectedTable.id];
                  onChange({ ...seatMap, tables: updatedTables, assignments });
                  setSelectedTableId(null);
                }}>
                  Xóa bàn
                </Button>
              </div>
            )}
          </div>

          {/* Zone / Stage editor */}
          {selectedRegion?.kind === "zone" && selectedRegion.id ? (
            (() => {
              const zone = seatMap.zones.find((z) => z.id === selectedRegion.id);
              if (!zone) return null;
              return (
                <div className="space-y-3">
                  <p className="text-sm font-medium">Chỉnh sửa vùng</p>
                  <div className="space-y-2 rounded-3xl border border-border-subtle bg-surface p-3">
                    <label className="block text-xs uppercase tracking-[0.3em] text-on-surface-muted">Tên vùng</label>
                    <input value={zone.name} onChange={(e) => {
                      const updated = seatMap.zones.map((z) => z.id === zone.id ? { ...z, name: e.target.value } : z);
                      updateMap({ zones: updated });
                    }} className="w-full rounded-soft border border-border-subtle px-3 py-2 text-sm" />

                    <label className="block text-xs uppercase tracking-[0.3em] text-on-surface-muted">Kích thước</label>
                    <div className="flex gap-2">
                      <input type="number" min={20} value={zone.width} onChange={(e) => {
                        const w = Number(e.target.value) || 0;
                        const updated = seatMap.zones.map((z) => z.id === zone.id ? { ...z, width: w } : z);
                        updateMap({ zones: updated });
                      }} className="w-1/2 rounded-soft border border-border-subtle px-3 py-2 text-sm" />
                      <input type="number" min={20} value={zone.height} onChange={(e) => {
                        const h = Number(e.target.value) || 0;
                        const updated = seatMap.zones.map((z) => z.id === zone.id ? { ...z, height: h } : z);
                        updateMap({ zones: updated });
                      }} className="w-1/2 rounded-soft border border-border-subtle px-3 py-2 text-sm" />
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => {
                        // center currently selected table into this zone
                        if (!selectedTable) return;
                        const tableIndex = seatMap.tables.findIndex((t) => t.id === selectedTable.id);
                        if (tableIndex < 0) return;
                        const updatedTables = [...seatMap.tables];
                        const tx = zone.x + Math.max(0, Math.round((zone.width - selectedTable.width) / 2 / GRID_SIZE) * GRID_SIZE);
                        const ty = zone.y + Math.max(0, Math.round((zone.height - selectedTable.height) / 2 / GRID_SIZE) * GRID_SIZE);
                        updatedTables[tableIndex] = { ...selectedTable, x: tx, y: ty };
                        updateMap({ tables: updatedTables });
                        setSelectedTableId(selectedTable.id);
                        setSelectedRegion({ kind: "table", id: selectedTable.id });
                      }}>
                        Căn giữa bàn ở đây
                      </Button>

                      <Button size="sm" variant="ghost" onClick={() => {
                        // remove zone
                        const updated = seatMap.zones.filter((z) => z.id !== zone.id);
                        const assignments = { ...seatMap.assignments };
                        updateMap({ zones: updated, assignments });
                        setSelectedRegion(null);
                      }}>
                        Xóa vùng
                      </Button>
                    </div>
                    <p className="text-xs opacity-60">Mẹo: kéo trên sơ đồ để di chuyển vùng.</p>
                  </div>
                </div>
              );
            })()
          ) : null}

          {selectedRegion?.kind === "stage" && seatMap.stage ? (
            <div className="space-y-3">
              <p className="text-sm font-medium">Chỉnh sửa sân khấu</p>
              <div className="space-y-2 rounded-3xl border border-border-subtle bg-surface p-3">
                <label className="block text-xs uppercase tracking-[0.3em] text-on-surface-muted">Chiều rộng</label>
                <input type="number" min={20} value={seatMap.stage.width} onChange={(e) => updateMap({ stage: { ...seatMap.stage!, width: Number(e.target.value) || 0 } })} className="w-full rounded-soft border border-border-subtle px-3 py-2 text-sm" />
                <label className="block text-xs uppercase tracking-[0.3em] text-on-surface-muted">Chiều cao</label>
                <input type="number" min={20} value={seatMap.stage.height} onChange={(e) => updateMap({ stage: { ...seatMap.stage!, height: Number(e.target.value) || 0 } })} className="w-full rounded-soft border border-border-subtle px-3 py-2 text-sm" />
                <p className="text-xs opacity-60">Mẹo: kéo trên sơ đồ để di chuyển sân khấu.</p>
              </div>
            </div>
          ) : null}

          <div className="space-y-3">
            <p className="text-sm font-medium">Phân công khách</p>
            <p className="text-xs opacity-70">Chọn bàn, sau đó gán khách cho bàn.</p>
            <div className="space-y-2 rounded-3xl border border-border-subtle bg-surface p-3">
              {selectedTable ? (
                <>
                  <p className="text-sm font-medium">Khách đã gán</p>
                  {selectedTableAssigned.length === 0 ? (
                    <p className="text-sm opacity-70">Chưa gán khách nào.</p>
                  ) : (
                    <ul className="space-y-2">
                      {selectedTableAssigned.map((guestId) => {
                        const guest = guests.find((item) => item.id === guestId);
                        return (
                          <li key={guestId} className="flex items-center justify-between gap-2 rounded-soft bg-surface px-3 py-2 text-sm">
                            <span>{guest?.full_name ?? "Khách không xác định"}</span>
                            <Button size="sm" variant="ghost" onClick={() => unassignGuest(guestId)}>
                              Xóa
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              ) : (
                <p className="text-sm opacity-70">Chọn bàn trước khi gán khách.</p>
              )}
            </div>
          </div>

          {selectedTable ? (
            <div className="space-y-3 rounded-3xl border border-border-subtle bg-surface p-3">
              <p className="text-sm font-medium">Khách có sẵn</p>
              <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                {unassignedGuests.map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between gap-2 rounded-soft bg-surface px-3 py-2 text-sm">
                    <div>
                      <p>{guest.full_name}</p>
                      <p className="text-xs opacity-60">{guest.relationship ?? "Khách"}</p>
                    </div>
                    <Button size="sm" variant="secondary" onClick={() => assignGuest(guest.id)}>
                      Gán
                    </Button>
                  </div>
                ))}
                {unassignedGuests.length === 0 && <p className="text-sm opacity-70">Không có khách nào chưa được gán.</p>}
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          <div className="rounded-3xl border border-border-subtle bg-surface-muted p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg">Xem trước sơ đồ</h3>
                <p className="text-sm opacity-70">Chọn bàn rồi kéo để di chuyển trên sơ đồ.</p>
              </div>
              <div className="rounded-2xl bg-surface px-3 py-1 text-xs uppercase tracking-[0.3em] text-on-surface-muted">
                Kéo để di chuyển
              </div>
            </div>
            <div
              ref={canvasRef}
              className="relative h-[520px] overflow-hidden rounded-3xl border border-border-subtle bg-surface bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.08),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(220,38,38,0.08),_transparent_35%)]"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              style={{ cursor: resizing ? "nwse-resize" : dragging ? "grabbing" : "grab" }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(15,23,42,0.04)_1px,transparent_1px)] bg-[length:20px_20px]" />
              {seatMap.stage ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTableId(null);
                    setSelectedRegion({ kind: "stage", id: seatMap.stage?.id });
                  }}
                  className={`absolute rounded-3xl border p-2 text-center text-sm ${
                    selectedRegion?.kind === "stage" ? "border-accent bg-accent/10 text-accent" : "border-blue-400 bg-sky-100/70 text-sky-900"
                  }`}
                  style={{ left: seatMap.stage.x, top: seatMap.stage.y, width: seatMap.stage.width, height: seatMap.stage.height }}
                >
                  Stage
                  {selectedRegion?.kind === "stage" && (
                    <div
                      onMouseDown={(e) => handleResizeStart(e, "stage")}
                      className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize rounded-bl-2xl bg-accent/60 hover:bg-accent"
                      style={{ transform: "translate(2px, 2px)" }}
                    />
                  )}
                </div>
              ) : null}
              {seatMap.zones.map((zone) => (
                <div
                  key={zone.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTableId(null);
                    setSelectedRegion({ kind: "zone", id: zone.id });
                  }}
                  className={`absolute rounded-3xl border p-2 text-sm ${
                    selectedRegion?.kind === "zone" && selectedRegion.id === zone.id ? "border-accent bg-accent/10 text-accent" : "border-orange-300 bg-orange-100/70 text-orange-900"
                  }`}
                  style={{ left: zone.x, top: zone.y, width: zone.width, height: zone.height }}
                >
                  {zone.name}
                  {selectedRegion?.kind === "zone" && selectedRegion.id === zone.id && (
                    <div
                      onMouseDown={(e) => handleResizeStart(e, "zone", zone.id)}
                      className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize rounded-bl-2xl bg-accent/60 hover:bg-accent"
                      style={{ transform: "translate(2px, 2px)" }}
                    />
                  )}
                </div>
              ))}
              {seatMap.tables.map((table) => {
                const count = (seatMap.assignments[table.id] ?? []).length;
                const isActive = table.id === selectedTableId;
                return (
                  <div
                    key={table.id}
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedTableId(table.id);
                      setSelectedRegion({ kind: "table", id: table.id });
                    }}
                    className={`absolute flex flex-col items-center justify-center rounded-3xl border p-2 text-sm text-slate-950 transition cursor-pointer ${
                      isActive ? "border-accent bg-accent/10 shadow-lg shadow-accent/10" : "border-border-subtle bg-slate-50"
                    }`}
                    style={{
                      left: table.x,
                      top: table.y,
                      width: table.width,
                      height: table.height,
                      borderRadius: table.shape === "round" ? "9999px" : "22px",
                    }}
                  >
                    <span className="font-medium">{table.name}</span>
                    <span className="text-xs opacity-70">{count}/{table.capacity}</span>
                    {isActive && (
                      <div
                        onMouseDown={(e) => handleResizeStart(e, "table")}
                        className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize rounded-bl-2xl bg-accent/60 hover:bg-accent"
                        style={{ transform: "translate(2px, 2px)" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
