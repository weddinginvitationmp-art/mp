import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { SeatMapJson } from "@/admin/seating/types";

export function useSeatMap() {
  const [seatMap, setSeatMap] = useState<SeatMapJson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeatMap = async () => {
      try {
        const { data, error } = await supabase
          .from("seat_maps")
          .select("json_data")
          .order("updated_at", { ascending: false })
          .limit(1)
          .single();

        if (error) {
          console.error("Failed to fetch seat map:", error);
          setLoading(false);
          return;
        }

  if (data && (data as any).json_data) {
          setSeatMap((data as any).json_data as SeatMapJson);
        }
      } catch (err) {
        console.error("Error fetching seat map:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSeatMap();
  }, []);

  return { seatMap, loading };
}
