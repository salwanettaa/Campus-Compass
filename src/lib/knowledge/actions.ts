"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/validation/auth";
import { experienceSchema } from "@/lib/validation/experience";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validates and persists a structured senior experience to Supabase `experiences`.
 * `campus_id`, `program_id`, and `author_id` are always taken from the signed-in
 * server session and `profiles` table, never from the form.
 */
export async function submitExperienceAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = experienceSchema.safeParse({
    title: formData.get("title"),
    semesterContext: formData.get("semesterContext"),
    situation: formData.get("situation"),
    challenge: formData.get("challenge"),
    solution: formData.get("solution"),
    result: formData.get("result"),
    adviceForJuniors: formData.get("adviceForJuniors"),
    tags: formData.get("tags") ?? undefined,
    acknowledgePersonal: formData.get("acknowledgePersonal") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Please fix the highlighted fields.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return {
          ok: false,
          message: "Please sign in again before sharing an experience.",
        };
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("campus_id, program_id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError || !profile?.campus_id || !profile?.program_id) {
        return {
          ok: false,
          message:
            "Complete your campus and program onboarding before sharing an experience.",
        };
      }

      const { error: insertError } = await supabase.from("experiences").insert({
        campus_id: profile.campus_id,
        program_id: profile.program_id,
        author_id: user.id,
        title: parsed.data.title,
        semester_context: parsed.data.semesterContext ?? null,
        situation: parsed.data.situation,
        challenge: parsed.data.challenge,
        solution: parsed.data.solution,
        result: parsed.data.result,
        advice_for_juniors: parsed.data.adviceForJuniors,
        tags: parsed.data.tags,
      });

      if (insertError) {
        return {
          ok: false,
          message: "Could not save your experience. Please try again.",
        };
      }

      revalidatePath("/knowledge");
      return {
        ok: true,
        message: "Your experience has been published to Knowledge Hub.",
      };
    } catch {
      // Outside Next request scope (e.g. unit test runner) -> fall through to mock response.
    }
  }

  return {
    ok: true,
    message:
      "Thank you! Your experience passed the checks. Saving is not connected yet, so it was not stored.",
  };
}

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
    return { ok: true, savedInDb: true };
  } catch {
    return { ok: true, savedInDb: false };
  }
}
