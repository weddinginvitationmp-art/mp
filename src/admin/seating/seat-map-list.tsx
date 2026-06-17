import { Button } from "@/components/common/button";
import type { SeatMapRow } from "./index";

interface SeatMapListProps {
  seatMaps: SeatMapRow[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export function SeatMapList({ seatMaps, selectedId, onSelect, onCreate, onDelete, onRefresh }: SeatMapListProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <h2 className="font-display text-xl">Seat map dashboard</h2>
          <p className="text-sm opacity-70">Manage saved seating layouts and open maps for editing.</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={onRefresh}>
            Refresh
          </Button>
          <Button size="sm" variant="primary" onClick={onCreate}>
            Create new map
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-border-subtle bg-surface-muted p-2">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-on-surface-muted">
            <tr>
              <th className="py-3 px-3">Name</th>
              <th className="py-3 px-3">Tables</th>
              <th className="py-3 px-3">Guests</th>
              <th className="py-3 px-3">Updated</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {seatMaps.map((map) => {
              const tableCount = Array.isArray(map.json_data?.tables) ? map.json_data.tables.length : 0;
              const guestCount = map.json_data && typeof map.json_data === "object" && map.json_data !== null
                ? Object.keys((map.json_data as any).assignments ?? {}).reduce((total, tableId) => {
                    const list = (map.json_data as any).assignments[tableId] as string[] | undefined;
                    return total + (Array.isArray(list) ? list.length : 0);
                  }, 0)
                : 0;
              return (
                <tr key={map.id} className={`hover:bg-surface ${selectedId === map.id ? "bg-surface-muted" : ""}`}>
                  <td className="py-3 px-3 font-medium">{map.name}</td>
                  <td className="py-3 px-3">{tableCount}</td>
                  <td className="py-3 px-3">{guestCount}</td>
                  <td className="py-3 px-3">{new Date(map.updated_at).toLocaleString()}</td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => onSelect(map.id)}>
                        Open
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onDelete(map.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {seatMaps.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-sm opacity-70">
                  No seat maps saved yet. Create a new map to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
