-- Wedding invitation — initial schema
-- Tables: guests, rsvp, wishes, media, games_leaderboard

-- Helper: updated_at trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- guests
CREATE TABLE IF NOT EXISTS guests (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_slug   VARCHAR(100) UNIQUE NOT NULL,
  full_name    VARCHAR(255) NOT NULL,
  phone        VARCHAR(20),
  email        VARCHAR(255),
  relationship VARCHAR(50),
  language     VARCHAR(2) DEFAULT 'vi' CHECK (language IN ('vi', 'en')),
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_guests_slug ON guests(guest_slug);
DROP TRIGGER IF EXISTS trg_guests_updated_at ON guests;
CREATE TRIGGER trg_guests_updated_at BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- rsvp
CREATE TABLE IF NOT EXISTS rsvp (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id             UUID NOT NULL UNIQUE REFERENCES guests(id) ON DELETE CASCADE,
  status               VARCHAR(20) NOT NULL CHECK (status IN ('attending', 'not_attending', 'pending')),
  party_size           INT DEFAULT 1 CHECK (party_size BETWEEN 1 AND 10),
  dietary_restrictions TEXT,
  song_request         VARCHAR(255),
  special_requests     TEXT,
  submitted_at         TIMESTAMPTZ DEFAULT now(),
  updated_at           TIMESTAMPTZ DEFAULT now()
);
DROP TRIGGER IF EXISTS trg_rsvp_updated_at ON rsvp;
CREATE TRIGGER trg_rsvp_updated_at BEFORE UPDATE ON rsvp
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- wishes
CREATE TABLE IF NOT EXISTS wishes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id   UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  message    TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 500),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_wishes_created_at ON wishes(created_at DESC);

-- media
CREATE TABLE IF NOT EXISTS media (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        VARCHAR(20) NOT NULL CHECK (type IN ('photo', 'video')),
  url         VARCHAR(500) NOT NULL,
  caption     TEXT,
  order_index INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_media_order ON media(order_index);

-- games_leaderboard
CREATE TABLE IF NOT EXISTS games_leaderboard (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id   UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  game_name  VARCHAR(50) NOT NULL CHECK (game_name IN ('love_memory', 'quiz', 'catch_bouquet')),
  score      INT NOT NULL CHECK (score >= 0),
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_leaderboard_game_score ON games_leaderboard(game_name, score DESC);
