-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add is_pinned column to wishes table
ALTER TABLE wishes
  ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN NOT NULL DEFAULT false;

-- RLS: anon cannot toggle is_pinned; admin via service role is enforced by Supabase RLS
-- No new RLS policy needed — UPDATE with is_pinned is blocked by existing policies
