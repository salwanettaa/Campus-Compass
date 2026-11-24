"use server";

import { redirect } from "next/navigation";
import { getAppUrl } from "@/lib/app-url";
import { safeNextPath } from "@/lib/auth/redirect";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import {
  loginSchema,
  registerSchema,
  type FormState,
} from "@/lib/validation/auth";
import { z } from "zod";

const NOT_CONFIGURED: FormState = {
  ok: false,
  message:
    "The app is not connected to Supabase yet. Set the Supabase keys in .env.local and restart the server.",
};

export async function signInAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!hasSupabaseEnv()) return NOT_CONFIGURED;

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    // Same message for every failure so we never reveal which emails exist.
    return { ok: false, message: "Invalid email or password." };
  }

  redirect(safeNextPath(formData.get("next")));
}

export async function signUpAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!hasSupabaseEnv()) return NOT_CONFIGURED;

  const parsed = registerSchema.safeParse({
    displayName: formData.get("displayName"),
    email: formData.get("email"),
    password: formData.get("password"),
    acceptPrivacy: formData.get("acceptPrivacy") === "on",
  });
  if (!parsed.success) {
    return {
      ok: false,
      fieldErrors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  const { displayName, email, password } = parsed.data;
  const appUrl = getAppUrl();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Stored in auth metadata; copied to profiles.display_name at onboarding.
      data: { display_name: displayName },
      emailRedirectTo: `${appUrl}/auth/callback?next=/onboarding`,
    },
  });

  if (error) {
    return {
      ok: false,
      message: "We could not create your account. Please try again.",
    };
  }

  // Email confirmation disabled: the user is already signed in.
  if (data.session) {
    redirect("/onboarding");
  }

  return {
    ok: true,
    message:
      "Almost there! Check your email and open the confirmation link to activate your account.",
  };
}

export async function signOutAction(): Promise<void> {
  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
