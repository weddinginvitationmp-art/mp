/**
 * Validates required Vite env vars at boot. Fails fast with a readable
 * message if anything is missing — better than silent runtime errors.
 */
const required = (key: string): string => {
  const value = import.meta.env[key] as string | undefined;
  if (!value) {
    throw new Error(`Missing env var: ${key}. Copy .env.example to .env.local and fill in.`);
  }
  return value;
};

export const env = {
  supabaseUrl: required("VITE_SUPABASE_URL"),
  supabaseAnonKey: required("VITE_SUPABASE_ANON_KEY"),
} as const;
