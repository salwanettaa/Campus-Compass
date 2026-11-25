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
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-4 py-5 sm:px-6 sm:py-8">
      <header className="flex items-center justify-between gap-4 border-b border-brand-950/15 pb-4">
        <Logo tone="onLight" href="/" />
        <p className="font-mono text-[10px] tracking-[0.14em] text-brand-700">
          PROFILE / SETUP
        </p>
      </header>
      <main className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-14">
        <section className="flex flex-col gap-4 lg:sticky lg:top-8">
          <p className="font-mono text-[10px] tracking-[0.16em] text-brand-700">
            THREE STEPS / YOUR CAMPUS
          </p>
          <h1 className="text-4xl leading-tight font-semibold tracking-[-0.05em] text-brand-950 sm:text-5xl">
            Make this space yours.
          </h1>
          <p className="text-body max-w-md text-brand-800">
            Set your campus, semester, and current focus. We&apos;ll use them to
            shape what you see.
          </p>
          <p className="mt-3 border-t border-brand-950/15 pt-4 font-mono text-[10px] tracking-[0.12em] text-brand-700">
            01 CAMPUS &nbsp; / &nbsp; 02 SEMESTER &nbsp; / &nbsp; 03 FOCUS
          </p>
        </section>
        <section
          aria-label="Profile setup form"
          className="flex flex-col gap-6 border border-brand-950/10 bg-paper-raised p-5 sm:p-8"
        >
          {children}
        </section>
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
