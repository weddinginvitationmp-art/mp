-- Phase 7: track outbound share clicks per guest+target.
-- guest_id is nullable: a guest who lands without a slug can still share
-- but their action will be anonymous.
CREATE TABLE IF NOT EXISTS guest_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  target VARCHAR(20) NOT NULL CHECK (target IN ('zalo', 'whatsapp', 'copy', 'native')),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_guest_shares_guest ON guest_shares (guest_id);
CREATE INDEX IF NOT EXISTS idx_guest_shares_target_time ON guest_shares (target, created_at DESC);

ALTER TABLE guest_shares ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS guest_shares_insert ON guest_shares;
CREATE POLICY guest_shares_insert ON guest_shares FOR INSERT WITH CHECK (true);

-- No public SELECT. Aggregates surface via service role only.
