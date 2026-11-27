"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Toggles a guide bookmark in Supabase `public.bookmarks`.
 * Falls back cleanly when viewing sample (non-DB) guides.
 */
export async function toggleBookmarkAction(
  guideId: string,
  shouldBookmark: boolean,
): Promise<{ ok: boolean; savedInDb: boolean; message?: string }> {
  if (!hasSupabaseEnv() || !UUID_REGEX.test(guideId)) {
    return { ok: true, savedInDb: false };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, savedInDb: false, message: "Not signed in." };
    }

    // Only persist if the guide exists in public.guides (sample mock UUIDs won't exist in DB).
    const { data: existingGuide } = await supabase
      .from("guides")
      .select("id")
      .eq("id", guideId)
      .maybeSingle();

    if (!existingGuide) {
      return { ok: true, savedInDb: false };
    }

    if (shouldBookmark) {
      const { error } = await supabase.from("bookmarks").upsert(
        { user_id: user.id, guide_id: guideId },
        { onConflict: "user_id,guide_id" },
      );
      if (error) {
        return { ok: false, savedInDb: false, message: error.message };
      }
    } else {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("guide_id", guideId);
      if (error) {
        return { ok: false, savedInDb: false, message: error.message };
      }
    }

    revalidatePath("/knowledge");
    revalidatePath("/home");
    return { ok: true, savedInDb: true };
  } catch {
    return { ok: true, savedInDb: false };
  }
}
