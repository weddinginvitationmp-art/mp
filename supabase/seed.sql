-- Seed: one test guest for smoke testing the client.
INSERT INTO guests (guest_slug, full_name, language)
VALUES ('test-guest', 'Nguyễn Test', 'vi')
ON CONFLICT (guest_slug) DO NOTHING;
