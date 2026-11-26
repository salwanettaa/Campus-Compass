import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { CompassRing } from "@/components/home/compass-ring";
import { createClient } from "@/lib/supabase/server";
import { ADAPTATION_AREAS, MAIN_CHALLENGES } from "@/lib/constants/onboarding";
import { categoryName } from "@/lib/knowledge/categories";
import type { GuideCategory } from "@/lib/knowledge/types";

export const metadata: Metadata = { title: "Home" };

const SHORTCUTS = [
  {
    href: "/community",
    title: "Read student questions",
    description: "See what others asked and which answers helped.",
  },
  {
    href: "/knowledge/share-experience",
    title: "Share what you learned",
    description: "Write down what worked so the next student can use it.",
  },
] as const;

/** The guide category that best matches each adaptation area. */
const AREA_GUIDES: Record<
  (typeof ADAPTATION_AREAS)[number]["value"],
  GuideCategory
> = {
  academic: "academic_survival",
  social: "social_community",
  administrative: "administrative_guide",
  personal: "academic_survival",
  facilities: "campus_essentials",
  opportunity: "scholarship_growth",
};

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

  const category = area ? AREA_GUIDES[area.value] : null;

  return (
    <main className="flex w-full flex-col gap-12">
      <header>
        <h1 className="text-h2 break-words text-brand-950">
          Welcome back, {profile?.display_name ?? "Student"}.
        </h1>
        {campusDetails.length > 0 ? (
          <p className="text-body mt-1 text-brand-800">{campusDetails.join(" · ")}</p>
        ) : null}
      </header>

      <section
        aria-labelledby="focus-heading"
        className="grid items-center gap-10 md:grid-cols-2 md:gap-12"
      >
        <CompassRing area={area?.value ?? null} />
        <div className="flex flex-col items-start">
          <h2 id="focus-heading" className="text-h1 text-brand-950">
            {category ? "Start where you need help" : "Find your first guide"}
          </h2>
          <p className="text-lead mt-4 text-brand-800">
            {area?.description ?? "Browse the six guide categories."}
          </p>
          {challenge ? (
            <p className="text-body mt-3 text-brand-800">
              Main challenge:{" "}
              <span className="font-semibold text-brand-950">{challenge.label}</span>
            </p>
          ) : null}
          <ButtonLink
            href={category ? `/knowledge?category=${category}` : "/knowledge"}
            size="lg"
            className="mt-7 h-auto min-h-12 w-full py-3 text-center whitespace-normal sm:w-auto"
          >
            {category
              ? `Read ${categoryName(category)} guides`
              : "Browse campus guides"}
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="next-heading">
        <h2 id="next-heading" className="text-h3 text-brand-950">
          Also useful
        </h2>
        <ul className="mt-3 divide-y divide-brand-300 border-y border-brand-300">
          {SHORTCUTS.map((shortcut) => (
            <li key={shortcut.href}>
              <Link
                href={shortcut.href}
                className="flex items-center justify-between gap-4 rounded-sm px-2 py-4 transition-colors hover:bg-brand-100 active:bg-brand-300"
              >
                <span className="flex flex-col gap-0.5">
                  <span className="text-h4 text-brand-950">{shortcut.title}</span>
                  <span className="text-body text-brand-800">{shortcut.description}</span>
                </span>
                <ArrowRight className="size-5 shrink-0 text-brand-700" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="my-journey"
        aria-labelledby="journey-heading"
        className="scroll-mt-6 rounded-2xl bg-paper-raised p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2 id="journey-heading" className="text-h3 text-brand-950">
            My Journey
          </h2>
          <p className="text-caption text-brand-700">Coming soon</p>
        </div>
        <p className="text-body mt-2 max-w-xl text-brand-800">
          Your personal roadmap is still being prepared. Until then, use the
          guides and the advice from senior students.
        </p>
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
