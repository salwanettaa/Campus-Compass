import type { Metadata } from "next";
import { Route } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/server";
import { ADAPTATION_AREAS, MAIN_CHALLENGES } from "@/lib/constants/onboarding";

export const metadata: Metadata = { title: "Home" };

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, campus_id, program_id, semester, adaptation_area, main_challenge")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  const [campusRes, programRes] = await Promise.all([
    profile?.campus_id
      ? supabase.from("campuses").select("name").eq("id", profile.campus_id).maybeSingle()
      : Promise.resolve({ data: null }),
    profile?.program_id
      ? supabase.from("programs").select("name").eq("id", profile.program_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const area = ADAPTATION_AREAS.find((a) => a.value === profile?.adaptation_area);
  const challenge = MAIN_CHALLENGES.find((c) => c.value === profile?.main_challenge);

  return (
    <main className="flex flex-col gap-6">
      <section className="rounded-3xl bg-linear-to-br from-brand-950 via-brand-900 to-brand-800 p-6 text-white shadow-card sm:p-8">
        <p className="text-h5 text-brand-300">Welcome back</p>
        <h1 className="text-h1 mt-1">{profile?.display_name ?? "Student"}</h1>
        <p className="text-body mt-2 text-brand-100/90">
          {[campusRes.data?.name, programRes.data?.name]
            .filter(Boolean)
            .join(" · ")}
          {profile?.semester ? ` · Semester ${profile.semester}` : ""}
        </p>
      </section>

      <section
        aria-labelledby="focus-heading"
        className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-card"
      >
        <h2 id="focus-heading" className="text-h3 text-brand-950">
          Your focus
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-caption text-brand-800">Adaptation area</dt>
            <dd className="text-h4 text-brand-950">{area?.label ?? "Not set"}</dd>
          </div>
          <div>
            <dt className="text-caption text-brand-800">Main challenge</dt>
            <dd className="text-h4 text-brand-950">{challenge?.label ?? "Not set"}</dd>
          </div>
        </dl>
      </section>

      <section
        id="my-journey"
        aria-labelledby="journey-heading"
        className="flex scroll-mt-6 flex-col gap-3 rounded-3xl bg-white p-6 shadow-card"
      >
        <h2 id="journey-heading" className="text-h3 text-brand-950">
          My Journey
        </h2>
        <Alert variant="info">
          <span className="inline-flex items-center gap-2">
            <Route className="size-4" aria-hidden="true" />
            Your personal roadmap will appear here soon.
          </span>
        </Alert>
      </section>
    </main>
  );
}
