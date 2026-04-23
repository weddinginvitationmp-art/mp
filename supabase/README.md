# Supabase

Project: `ceppcwfbtykubukgwtxd` (Singapore region).

## Apply migrations

Open Supabase Dashboard → SQL Editor → New query, then run in order:

1. `migrations/0001_init.sql` — tables, indexes, triggers
2. `migrations/0002_rls_policies.sql` — RLS policies
3. `seed.sql` — one test guest (`guest_slug = test-guest`)

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
