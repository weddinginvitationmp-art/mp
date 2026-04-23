import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { env } from "./env";

// Singleton — invitation site has no auth; persist disabled keeps bundle smaller.
export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
  auth: { persistSession: false },
});
