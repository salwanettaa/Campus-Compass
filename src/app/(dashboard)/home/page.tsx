import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ADAPTATION_AREAS, MAIN_CHALLENGES } from "@/lib/constants/onboarding";

export const metadata: Metadata = { title: "Home" };

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("display_name, campus_id, program_id, semester, adaptation_area, main_challenge")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  if (profileError) return <HomeLoadError />;

  const [campusRes, programRes] = await Promise.all([
    profile?.campus_id
      ? supabase.from("campuses").select("name").eq("id", profile.campus_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    profile?.program_id
      ? supabase.from("programs").select("name").eq("id", profile.program_id).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  // Missing profile data must not look like "not set": show an error instead.
  if (campusRes.error || programRes.error) return <HomeLoadError />;

  const area = ADAPTATION_AREAS.find((a) => a.value === profile?.adaptation_area);
  const challenge = MAIN_CHALLENGES.find((c) => c.value === profile?.main_challenge);
  const campusDetails = [
    campusRes.data?.name,
    programRes.data?.name,
    profile?.semester ? `Semester ${profile.semester}` : null,
  ].filter(Boolean);

  return (
    <main className="flex flex-col gap-8">
      <header className="flex flex-col gap-4 border-b border-brand-950/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="font-mono text-[10px] tracking-[0.16em] text-brand-700">
            YOUR SPACE / HOME
          </p>
          <h1 className="mt-2 break-words text-4xl leading-tight font-semibold tracking-[-0.05em] text-brand-950 sm:text-5xl">
            Welcome back, {profile?.display_name ?? "Student"}.
          </h1>
          <p className="text-body mt-3 max-w-xl text-brand-800">
            Campus life comes one question and one useful step at a time.
          </p>
        </div>
        {campusDetails.length > 0 ? (
          <ul
            className="flex flex-wrap gap-x-4 gap-y-2 sm:justify-end"
            aria-label="Campus details"
          >
            {campusDetails.map((detail) => (
              <li
                key={detail}
                className="border-l border-brand-300 pl-3 text-caption text-brand-800"
              >
                {detail}
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <section
        aria-labelledby="focus-heading"
        className="flex flex-col gap-5"
      >
        <div className="border-b border-brand-950/15 pb-3">
          <p className="font-mono text-[10px] tracking-[0.16em] text-brand-700">
            CHECK-IN / CURRENT FOCUS
          </p>
          <h2 id="focus-heading" className="mt-1 text-2xl font-semibold tracking-tight text-brand-950">
            What matters to you right now?
          </h2>
        </div>
        <dl className="grid gap-x-8 sm:grid-cols-2">
          <div className="border-t border-brand-950/15 py-3">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-700">
              Adaptation area
            </dt>
            <dd className="mt-1 text-lg font-medium text-brand-950">
              {area?.label ?? "Not set"}
            </dd>
          </div>
          <div className="border-t border-brand-950/15 py-3">
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-700">
              Main challenge
            </dt>
            <dd className="mt-1 text-lg font-medium text-brand-950">
              {challenge?.label ?? "Not set"}
            </dd>
          </div>
        </dl>
      </section>

      <section
        id="my-journey"
        aria-labelledby="journey-heading"
        className="grid scroll-mt-6 gap-6 border border-brand-950/10 bg-paper-raised p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6"
      >
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] text-brand-700">
            MY JOURNEY / ROADMAP
          </p>
          <h2 id="journey-heading" className="mt-2 text-2xl font-semibold tracking-tight text-brand-950">
            Small steps make campus feel more navigable.
          </h2>
          <p className="text-body mt-2 max-w-xl text-brand-800">
            Your personal roadmap is still being prepared. Explore practical
            guides and advice from senior students in the meantime.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 border-t border-brand-950/15 pt-4 sm:border-t-0 sm:border-l sm:py-2 sm:pl-6">
          <span className="font-mono text-[10px] tracking-wide text-brand-700">
            ROADMAP / COMING SOON
          </span>
          <ButtonLink
            href="/knowledge"
            variant="pillOnLight"
            size="sm"
            className="w-full sm:w-fit"
          >
            Explore guides
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}

function HomeLoadError() {
  return (
    <main className="flex flex-col items-start gap-3">
      <Alert variant="error" title="We could not load your home page">
        Something went wrong on our side. Please try again.
      </Alert>
      <ButtonLink href="/home" variant="outline" size="sm">
        Try again
      </ButtonLink>
    </main>
  );
}
