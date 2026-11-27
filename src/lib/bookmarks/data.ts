import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export async function getSavedBookmarkIds(): Promise<{
  guideIds: string[];
  postIds: string[];
}> {
  if (!hasSupabaseEnv()) {
    return { guideIds: [], postIds: [] };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { guideIds: [], postIds: [] };

    const { data, error } = await supabase
      .from("bookmarks")
      .select("guide_id, post_id")
      .eq("user_id", user.id);

    if (error || !data) {
      return { guideIds: [], postIds: [] };
    }

    const guideIds: string[] = [];
    const postIds: string[] = [];
    for (const row of data) {
      if (row.guide_id) guideIds.push(row.guide_id);
      if (row.post_id) postIds.push(row.post_id);
    }
    return { guideIds, postIds };
  } catch {
    return { guideIds: [], postIds: [] };
  }
}
