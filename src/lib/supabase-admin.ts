import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { env } from "./env";

/**
 * Authenticated Supabase client for the admin console.
 * Separate instance (distinct localStorage key) so public-facing anon client
 * stays stateless — no cross-contamination between guest and admin sessions.
 */
export const supabaseAdmin = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "wi.admin.session",
  },
});
