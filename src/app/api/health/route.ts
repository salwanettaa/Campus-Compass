import { NextResponse } from "next/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

// Never cache: this reports the live deployment's configuration state.
export const dynamic = "force-dynamic";

/**
 * Deployment smoke check. Reports only whether config is present, never values.
 * After deploying, open /api/health and expect {"status":"ok","supabaseConfigured":true}.
 */
export function GET() {
  return NextResponse.json(
    { status: "ok", supabaseConfigured: hasSupabaseEnv() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
