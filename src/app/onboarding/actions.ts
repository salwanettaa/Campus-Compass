"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { onboardingSchema } from "@/lib/validation/onboarding";
import type { FormState } from "@/lib/validation/auth";

export async function completeOnboardingAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      message: "The app is not connected to Supabase yet.",
    };
  }

  const parsed = onboardingSchema.safeParse({
    campusId: formData.get("campusId"),
    facultyId: formData.get("facultyId"),
    programId: formData.get("programId"),
    semester: formData.get("semester"),
    adaptationArea: formData.get("adaptationArea"),
    mainChallenge: formData.get("mainChallenge"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      message: "Please complete every step before finishing.",
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }
  const input = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // RLS does not check that the program belongs to the chosen campus/faculty,
  // so verify the whole chain here. Cross-tenant ids must never be saved.
  const { data: program, error: programError } = await supabase
    .from("programs")
    .select("id")
    .eq("id", input.programId)
    .eq("campus_id", input.campusId)
    .eq("faculty_id", input.facultyId)
    .maybeSingle();

  if (programError) {
    return {
      ok: false,
      message: "We could not verify your program. Please try again.",
    };
  }
  if (!program) {
    return {
      ok: false,
      message: "That campus, faculty and program do not match. Please re-select.",
    };
  }

  const metadataName = user.user_metadata?.display_name;
  const displayName =
    typeof metadataName === "string" && metadataName.trim()
      ? metadataName.trim().slice(0, 100)
      : "Mahasiswa";

  // `role` is omitted on purpose: it defaults to 'student' and users cannot
  // change it (see trg_protect_profile_update).
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    campus_id: input.campusId,
    faculty_id: input.facultyId,
    program_id: input.programId,
    display_name: displayName,
    semester: input.semester,
    adaptation_area: input.adaptationArea,
    main_challenge: input.mainChallenge,
    onboarding_completed: true,
  });

  if (error) {
    return {
      ok: false,
      message: "We could not save your profile. Please try again.",
    };
  }

  redirect("/home");
}
