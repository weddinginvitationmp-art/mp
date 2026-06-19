# Supabase

Project: `ceppcwfbtykubukgwtxd` (Singapore region).

## Apply migrations

Open Supabase Dashboard → SQL Editor → New query, then run every file in `migrations/` in numeric order, followed by `seed.sql`.

Minimum sequence for the current schema:

1. `migrations/0001_init.sql` — tables, indexes, triggers
2. `migrations/0002_rls_policies.sql` — RLS policies
3. `migrations/0003_open_rsvp_insert.sql` — RSVP insert access
4. `migrations/0004_game_scores.sql` — game scores table
5. `migrations/0005_guest_shares.sql` — share tracking
6. `migrations/0006_admin_policies.sql` — admin access rules
7. `migrations/0007_wishes_pin.sql` — add `wishes.is_pinned`
8. `migrations/0008_seat_maps.sql` — seat map tables
9. `migrations/0009_wishes_is_pinned.sql` — safety migration for pinning
10. `seed.sql` — one test guest (`guest_slug = test-guest`)

## Enable Realtime

Dashboard → Database → Replication → enable for `wishes` and `games_leaderboard`.

## Verify

In SQL Editor:
```sql
SELECT * FROM guests WHERE guest_slug = 'test-guest';
```
Should return one row.

## Schema overview

| Table | Purpose | Public read | Public write |
|-------|---------|-------------|--------------|
| guests | Invitee list | ✓ | ✗ (service role only) |
| rsvp | RSVP submissions | ✓ | insert + update (FK-checked) |
| wishes | Guestbook feed | ✓ | insert only (length-checked) |
| media | Photos/videos catalog | ✓ | ✗ |
| games_leaderboard | Mini-game scores | ✓ | insert only |

## Note on tightening writes

Phase 0 leaves `rsvp` and `wishes` writable by any anon client. Acceptable for an invite-only audience. Before publicizing share links, consider:
- Edge Function rate-limit on `wishes` insert
- `rsvp` UPDATE keyed to a guest session token instead of `USING (true)`
