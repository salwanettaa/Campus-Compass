"use server";

import { revalidatePath } from "next/cache";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Toggles a community post bookmark in Supabase `public.bookmarks`.
 * Falls back cleanly when viewing sample (non-DB) posts.
 */
export async function togglePostBookmarkAction(
  postId: string,
  shouldBookmark: boolean,
): Promise<{ ok: boolean; savedInDb: boolean; message?: string }> {
  if (!hasSupabaseEnv() || !UUID_REGEX.test(postId)) {
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

    const { data: existingPost } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .maybeSingle();

    if (!existingPost) {
      return { ok: true, savedInDb: false };
    }

    if (shouldBookmark) {
      const { error } = await supabase.from("bookmarks").upsert(
        { user_id: user.id, post_id: postId },
        { onConflict: "user_id,post_id" },
      );
      if (error) {
        return { ok: false, savedInDb: false, message: error.message };
      }
    } else {
      const { error } = await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);
      if (error) {
        return { ok: false, savedInDb: false, message: error.message };
      }
    }

    revalidatePath("/community");
    revalidatePath("/home");
    return { ok: true, savedInDb: true };
  } catch {
    return { ok: true, savedInDb: false };
  }
}
