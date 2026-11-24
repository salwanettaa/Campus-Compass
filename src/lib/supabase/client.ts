import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./env";

/** Browser-side Supabase client (anon key, protected by RLS). */
export function createClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createBrowserClient(url, anonKey);
}
