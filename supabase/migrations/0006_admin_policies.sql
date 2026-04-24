-- Phase 8: admin RLS policies. Authenticated role gets UPDATE/DELETE + broad SELECT;
-- anon keeps existing public-facing INSERT + SELECT where already permitted.

-- guests: admin can update/delete
DROP POLICY IF EXISTS guests_admin_update ON guests;
CREATE POLICY guests_admin_update ON guests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS guests_admin_delete ON guests;
CREATE POLICY guests_admin_delete ON guests FOR DELETE TO authenticated USING (true);

-- rsvp: admin read-all + delete
DROP POLICY IF EXISTS rsvp_admin_select ON rsvp;
CREATE POLICY rsvp_admin_select ON rsvp FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS rsvp_admin_delete ON rsvp;
CREATE POLICY rsvp_admin_delete ON rsvp FOR DELETE TO authenticated USING (true);

-- wishes: admin delete
DROP POLICY IF EXISTS wishes_admin_delete ON wishes;
CREATE POLICY wishes_admin_delete ON wishes FOR DELETE TO authenticated USING (true);

-- game_scores: admin delete
DROP POLICY IF EXISTS game_scores_admin_delete ON game_scores;
CREATE POLICY game_scores_admin_delete ON game_scores FOR DELETE TO authenticated USING (true);

-- guest_shares: admin select
DROP POLICY IF EXISTS guest_shares_admin_select ON guest_shares;
CREATE POLICY guest_shares_admin_select ON guest_shares FOR SELECT TO authenticated USING (true);
