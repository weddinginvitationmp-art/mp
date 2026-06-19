-- Ensure wishes supports pinning in every deployed database.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

ALTER TABLE wishes
  ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;