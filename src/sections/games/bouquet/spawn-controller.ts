export type SpriteKind = "normal" | "golden";

export interface Sprite {
  id: number;
  x: number; // 0..100 (% of container width)
  y: number; // pixels from top
  vy: number; // px per ms
  kind: SpriteKind;
  caught: boolean;
}

export const ROUND_DURATION_MS = 30_000;
export const POINTS_NORMAL = 10;
export const POINTS_GOLDEN = 30;
export const PENALTY_MISS = 5;
export const MAX_SPRITES = 6;
export const SPAWN_MIN_MS = 500;
export const SPAWN_MAX_MS = 900;
export const FALL_VY_MIN = 0.12;
export const FALL_VY_MAX = 0.22;
export const GOLDEN_RATE = 0.05;
