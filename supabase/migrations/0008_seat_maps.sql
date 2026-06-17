-- Create seat_maps table
create table if not exists public.seat_maps (
  id uuid not null primary key default gen_random_uuid(),
  event_id uuid,
  name text not null,
  json_data jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Enable RLS
alter table public.seat_maps enable row level security;

-- Allow all users to view seat maps
create policy "Seat maps are viewable by all"
  on public.seat_maps
  for select
  using (true);

-- Allow admin operations via service role (bypasses RLS)
create policy "Admin can insert seat maps"
  on public.seat_maps
  for insert
  with check (true);

create policy "Admin can update seat maps"
  on public.seat_maps
  for update
  using (true)
  with check (true);

create policy "Admin can delete seat maps"
  on public.seat_maps
  for delete
  using (true);

-- Create index for faster lookups
create index if not exists idx_seat_maps_event_id on public.seat_maps(event_id);
create index if not exists idx_seat_maps_updated_at on public.seat_maps(updated_at);
