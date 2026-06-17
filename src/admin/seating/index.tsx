import { useEffect, useState } from "react";
import { Button } from "@/components/common/button";
import { supabaseAdmin } from "@/lib/supabase-admin";
import type { Database } from "@/types/database";
import { createEmptySeatMap, createImportedSeatMap, type SeatMapJson } from "./types";
import { SeatMapDesigner } from "./seat-map-designer";
import { SeatMapList } from "./seat-map-list";

export type SeatMapRow = Database["public"]["Tables"]["seat_maps"]["Row"];

export function SeatingModule() {
  const [seatMaps, setSeatMaps] = useState<SeatMapRow[]>([]);
  const [guests, setGuests] = useState<Database["public"]["Tables"]["guests"]["Row"][]>([]);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const [seatMap, setSeatMap] = useState<SeatMapJson>(createEmptySeatMap());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<"list" | "designer">("list");

  const fetchSeatMaps = async () => {
    const { data, error } = await supabaseAdmin.from("seat_maps").select("*").order("updated_at", { ascending: false });
    if (error) {
      console.error(error);
      setSeatMaps([]);
      return;
    }
    setSeatMaps(data ?? []);
  };

  const fetchGuests = async () => {
    const { data, error } = await supabaseAdmin
      .from("guests")
      .select("id,full_name,guest_slug,relationship,language")
      .order("full_name", { ascending: true });
    if (error) {
      console.error(error);
      setGuests([]);
      return;
    }
    setGuests(data ?? []);
  };

  useEffect(() => {
    setLoading(true);
    void Promise.all([fetchSeatMaps(), fetchGuests()]).finally(() => setLoading(false));
  }, []);

  const openList = () => {
    setMode("list");
    setActiveMapId(null);
    setSeatMap(createEmptySeatMap());
  };

  const handleCreate = () => {
    setSeatMap(createEmptySeatMap());
    setActiveMapId(null);
    setMode("designer");
  };

  const handleSelect = (id: string) => {
    const row = seatMaps.find((item) => item.id === id);
    if (!row) return;
    const mapJson = ((row.json_data as unknown) as SeatMapJson) ?? createEmptySeatMap();
    setSeatMap({
      ...createEmptySeatMap(),
      ...mapJson,
    });
    setActiveMapId(id);
    setMode("designer");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this seat map?")) return;
    const { error } = await supabaseAdmin.from("seat_maps").delete().eq("id", id);
    if (error) {
      console.error(error);
      return;
    }
    await fetchSeatMaps();
    if (activeMapId === id) {
      openList();
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activeMapId) {
        const { error } = await supabaseAdmin
          .from("seat_maps")
          .update({ name: seatMap.name, json_data: seatMap } as never)
          .eq("id", activeMapId);
        if (error) {
          console.error(error);
          return;
        }
      } else {
        const { data, error } = await supabaseAdmin
          .from("seat_maps")
          .insert({ event_id: null, name: seatMap.name, json_data: seatMap } as any)
          .select("id")
          .single();
        if (error || !data) {
          console.error(error);
          return;
        }
        setActiveMapId((data as { id: string }).id);
      }
      await fetchSeatMaps();
    } finally {
      setSaving(false);
    }
  };

  const handleImportImage = (file: File) => {
    const imported = createImportedSeatMap(file.name);
    setSeatMap(imported);
    setActiveMapId(null);
    setMode("designer");
  };

  if (loading) {
    return <p className="text-sm opacity-70">Loading seating module…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div>
          <h1 className="font-display text-2xl">Seating arrangement</h1>
          <p className="text-sm opacity-70">Design and assign guest seating maps for your event.</p>
        </div>
        {mode === "list" ? (
          <Button size="sm" variant="primary" onClick={handleCreate}>
            New seat map
          </Button>
        ) : null}
      </div>

      {mode === "list" ? (
        <SeatMapList
          seatMaps={seatMaps}
          selectedId={activeMapId}
          onSelect={handleSelect}
          onCreate={handleCreate}
          onDelete={handleDelete}
          onRefresh={fetchSeatMaps}
        />
      ) : (
        <SeatMapDesigner
          seatMap={seatMap}
          guests={guests}
          onChange={setSeatMap}
          onSave={handleSave}
          onClose={openList}
          onImportImage={handleImportImage}
          saving={saving}
        />
      )}
    </div>
  );
}
