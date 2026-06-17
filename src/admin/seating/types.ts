export type TableShape = "round" | "rectangle" | "oval";

export interface SeatTable {
  id: string;
  name: string;
  shape: TableShape;
  capacity: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface StageShape {
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface ZoneShape {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export type SeatMapAssignments = Record<string, string[]>;

export interface SeatMapJson {
  name: string;
  tables: SeatTable[];
  stage?: StageShape;
  zones: ZoneShape[];
  assignments: SeatMapAssignments;
  defaultTableWidth?: number;
  defaultTableHeight?: number;
}

export function createEmptySeatMap(): SeatMapJson {
  return {
    name: "New seating map",
    tables: [],
    zones: [],
    assignments: {},
    defaultTableWidth: 140,
    defaultTableHeight: 140,
  };
}

export function createImportedSeatMap(fileName: string): SeatMapJson {
  return {
    name: `Imported from ${fileName}`,
    tables: [
      {
        id: "table-1",
        name: "Table 1",
        shape: "round",
        capacity: 10,
        x: 80,
        y: 80,
        width: 140,
        height: 140,
      },
      {
        id: "table-2",
        name: "Table 2",
        shape: "round",
        capacity: 10,
        x: 260,
        y: 80,
        width: 140,
        height: 140,
      },
      {
        id: "table-3",
        name: "Table 3",
        shape: "round",
        capacity: 10,
        x: 80,
        y: 250,
        width: 140,
        height: 140,
      },
      {
        id: "table-4",
        name: "Table 4",
        shape: "round",
        capacity: 10,
        x: 260,
        y: 250,
        width: 140,
        height: 140,
      },
    ],
    stage: {
      id: "stage-1",
      x: 80,
      y: 420,
      width: 320,
      height: 100,
    },
    zones: [
      {
        id: "zone-vip",
        name: "VIP Zone",
        color: "#FDE68A",
        x: 440,
        y: 80,
        width: 220,
        height: 150,
      },
    ],
    assignments: {},
  };
}

export function createTable(name: string, x: number, y: number): SeatTable {
  return {
    id: `table-${crypto.randomUUID()}`,
    name,
    shape: "round",
    capacity: 10,
    x,
    y,
    width: 140,
    height: 140,
  };
}
