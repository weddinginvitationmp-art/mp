export type GameKind = "memory" | "quiz" | "bouquet";

export interface LeaderboardRow {
  id: string;
  guest_id: string;
  guest_name: string;
  score: number;
  meta: Record<string, unknown>;
  created_at: string;
}

export interface SubmitScoreInput {
  game: GameKind;
  score: number;
  meta?: Record<string, unknown>;
}
