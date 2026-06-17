import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SeatMapJson } from "@/admin/seating/types";

export interface SeatMapWithId {
  id: string;
  name: string;
  json_data: SeatMapJson;
  updated_at: string;
}

export function useSeatMap(selectedMapId?: string) {
  const [seatMap, setSeatMap] = useState<SeatMapJson | null>(null);
  const [allMaps, setAllMaps] = useState<SeatMapWithId[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeatMaps = async () => {
      try {
        const { data, error } = await supabase
          .from("seat_maps")
          .select("id, name, json_data, updated_at")
          .order("updated_at", { ascending: false });

        if (error) {
          console.error("Failed to fetch seat maps:", error);
          setLoading(false);
          return;
        }

        const maps = (data || []) as SeatMapWithId[];
        setAllMaps(maps);

        // Use selected map ID if provided, otherwise use the latest
        const mapToUse = selectedMapId 
          ? maps.find(m => m.id === selectedMapId) 
          : maps[0];

        if (mapToUse) {
          setSeatMap(mapToUse.json_data);
        }
      } catch (err) {
        console.error("Error fetching seat maps:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatMaps();
  }, [selectedMapId]);

  return { seatMap, allMaps, loading };
}
