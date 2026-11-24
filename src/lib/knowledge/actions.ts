"use server";

import { z } from "zod";
import { experienceSchema } from "@/lib/validation/experience";
import type { FormState } from "@/lib/validation/auth";

/**
 * Validates a structured senior experience.
 *
 * MOCK: nothing is saved yet. When the database is connected this must also
 * check the signed-in user and insert into `experiences`, taking `campus_id`
 * and `program_id` from the user's profile (never from the form).
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

  return {
    ok: true,
    message:
      "Thank you! Your experience passed the checks. Saving is not connected yet, so it was not stored.",
  };
}
