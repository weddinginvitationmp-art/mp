-- Row-level security: public read where appropriate, narrowed writes.

ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS guests_read ON guests;
CREATE POLICY guests_read ON guests FOR SELECT USING (true);
-- No insert/update/delete: guest list managed via service role only.

ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS rsvp_read ON rsvp;
DROP POLICY IF EXISTS rsvp_insert ON rsvp;
DROP POLICY IF EXISTS rsvp_update ON rsvp;
CREATE POLICY rsvp_read ON rsvp FOR SELECT USING (true);
CREATE POLICY rsvp_insert ON rsvp FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM guests WHERE guests.id = rsvp.guest_id));
CREATE POLICY rsvp_update ON rsvp FOR UPDATE USING (true)
  WITH CHECK (EXISTS (SELECT 1 FROM guests WHERE guests.id = rsvp.guest_id));

ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS wishes_read ON wishes;
DROP POLICY IF EXISTS wishes_insert ON wishes;
CREATE POLICY wishes_read ON wishes FOR SELECT USING (true);
CREATE POLICY wishes_insert ON wishes FOR INSERT
  WITH CHECK (
    char_length(message) BETWEEN 1 AND 500
    AND EXISTS (SELECT 1 FROM guests WHERE guests.id = wishes.guest_id)
  );

ALTER TABLE media ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS media_read ON media;
CREATE POLICY media_read ON media FOR SELECT USING (true);

ALTER TABLE games_leaderboard ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS leaderboard_read ON games_leaderboard;
DROP POLICY IF EXISTS leaderboard_insert ON games_leaderboard;
CREATE POLICY leaderboard_read ON games_leaderboard FOR SELECT USING (true);
CREATE POLICY leaderboard_insert ON games_leaderboard FOR INSERT
  WITH CHECK (
    score >= 0
    AND EXISTS (SELECT 1 FROM guests WHERE guests.id = guest_id)
  );
