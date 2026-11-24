import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Alert } from "@/components/ui/alert";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Campus, Faculty, Program } from "@/types/database";

export const metadata: Metadata = { title: "Set up your profile" };

// Depends on the signed-in user's session; never prerender.
export const dynamic = "force-dynamic";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-5 py-10">
      <Logo tone="onLight" href="/" />
      <main className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-h2 text-brand-950">Let&apos;s set up your profile</h1>
          <p className="text-body text-brand-800">
            Three quick steps so Campus Compass can fit your campus life.
          </p>
        </header>
        {children}
      </main>
    </div>
  );
}

export default async function OnboardingPage() {
  if (!hasSupabaseEnv()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();
  if (profile?.onboarding_completed) redirect("/home");

  const [campusesRes, facultiesRes, programsRes] = await Promise.all([
    supabase
      .from("campuses")
      .select("id, name, slug, domain, is_active")
      .eq("is_active", true)
      .order("name"),
    supabase
      .from("faculties")
      .select("id, campus_id, name, code")
      .order("name"),
    supabase
      .from("programs")
      .select("id, campus_id, faculty_id, name, code, degree_level, is_pilot")
      .order("name"),
  ]);

  if (campusesRes.error || facultiesRes.error || programsRes.error) {
    return (
      <Shell>
        <Alert variant="error" title="We could not load campuses">
          Please refresh the page. If this keeps happening, the campus data may
          not be set up yet.
        </Alert>
      </Shell>
    );
  }

  const campuses = (campusesRes.data ?? []) as Campus[];
  if (campuses.length === 0) {
    return (
      <Shell>
        <Alert variant="info" title="No campuses yet">
          No campus is open for sign up right now. Please check back soon.
        </Alert>
      </Shell>
    );
  }

  return (
    <Shell>
      <OnboardingForm
        campuses={campuses}
        faculties={(facultiesRes.data ?? []) as Faculty[]}
        programs={(programsRes.data ?? []) as Program[]}
      />
    </Shell>
  );
}
