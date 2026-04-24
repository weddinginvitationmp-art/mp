-- Open-RSVP: allow anon clients to insert into guests when there's no
-- pre-existing entry for the visitor. Length checks keep payloads sane.
-- Trade-off: anon write surface is open until honeypot/rate-limit added.
DROP POLICY IF EXISTS guests_insert ON guests;
CREATE POLICY guests_insert ON guests FOR INSERT
  WITH CHECK (
    char_length(guest_slug) BETWEEN 2 AND 100
    AND char_length(full_name) BETWEEN 2 AND 255
  );
