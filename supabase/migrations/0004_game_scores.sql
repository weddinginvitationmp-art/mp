-- Phase 6: mini-games & leaderboard.
-- Unified score table for all games; `meta` JSONB stores per-game extras
-- (e.g. memory moves+time, quiz correct count, bouquet caught/missed).
CREATE TABLE IF NOT EXISTS game_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  game VARCHAR(20) NOT NULL CHECK (game IN ('memory', 'quiz', 'bouquet')),
  score INT NOT NULL CHECK (score >= 0 AND score <= 100000),
  meta JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_game_scores_game_score
  ON game_scores (game, score DESC, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_game_scores_guest
  ON game_scores (guest_id);

ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS game_scores_select ON game_scores;
CREATE POLICY game_scores_select ON game_scores FOR SELECT USING (true);

-- Anon inserts allowed — identity enforced via guest_id FK + length checks on
-- guest payload (covered by guests_insert policy). Keep surface open to match
-- wishes/rsvp pattern; add rate-limit later if needed.
DROP POLICY IF EXISTS game_scores_insert ON game_scores;
CREATE POLICY game_scores_insert ON game_scores FOR INSERT
  WITH CHECK (
    guest_id IS NOT NULL
    AND score >= 0
    AND score <= 100000
  );

-- Enable realtime publication for leaderboard live updates.
ALTER PUBLICATION supabase_realtime ADD TABLE game_scores;
