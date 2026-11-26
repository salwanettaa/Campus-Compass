import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { RouteLine } from "@/components/ui/route-line";
import { createClient } from "@/lib/supabase/server";
import { ADAPTATION_AREAS, MAIN_CHALLENGES } from "@/lib/constants/onboarding";

export const metadata: Metadata = { title: "Home" };

const SHORTCUTS = [
  {
    href: "/community",
    title: "Read student questions",
    description: "See what others asked and which answers helped.",
  },
  {
    href: "/knowledge",
    title: "Find a campus guide",
    description: "Six categories, each guide with its source.",
  },
  {
    href: "/knowledge/share-experience",
    title: "Share what you learned",
    description: "Write down what worked so the next student can use it.",
  },
] as const;

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
    <main className="flex w-full flex-col gap-10">
      <header className="bg-hero-gradient overflow-hidden rounded-[2rem] text-white">
        <div className="px-6 pt-8 sm:px-10 sm:pt-10">
          <h1 className="text-h1 break-words">
            Welcome back, {profile?.display_name ?? "Student"}.
          </h1>
          {campusDetails.length > 0 ? (
            <p className="text-lead mt-3 text-brand-100">
              {campusDetails.join(" · ")}
            </p>
          ) : null}
        </div>
        <RouteLine className="h-20" />
      </header>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
        <section aria-labelledby="next-heading">
          <h2 id="next-heading" className="text-h2 text-brand-950">
            Where to go next
          </h2>
          <ul className="mt-4 flex flex-col gap-4">
            {SHORTCUTS.map((shortcut) => (
              <li key={shortcut.href}>
                <Link
                  href={shortcut.href}
                  className="bg-card-tint flex items-center justify-between gap-4 rounded-md border border-brand-300 p-5 transition-colors hover:border-brand-700"
                >
                  <span className="flex flex-col gap-1">
                    <span className="text-h3 text-brand-950">{shortcut.title}</span>
                    <span className="text-body text-brand-800">{shortcut.description}</span>
                  </span>
                  <ArrowRight className="size-5 shrink-0 text-brand-700" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="focus-heading"
          className="h-fit rounded-md border border-brand-300 bg-paper-raised p-5 sm:p-6"
        >
          <h2 id="focus-heading" className="text-h2 text-brand-950">
            Your current focus
          </h2>
          <dl className="mt-4 divide-y divide-brand-300 border-t border-brand-300">
            <div className="py-3">
              <dt className="text-caption text-brand-800">Adaptation area</dt>
              <dd className="text-h4 mt-1 text-brand-950">{area?.label ?? "Not set"}</dd>
            </div>
            <div className="pt-3">
              <dt className="text-caption text-brand-800">Main challenge</dt>
              <dd className="text-h4 mt-1 text-brand-950">{challenge?.label ?? "Not set"}</dd>
            </div>
          </dl>
        </section>
      </div>

      <section
        id="my-journey"
        aria-labelledby="journey-heading"
        className="flex scroll-mt-6 flex-col items-start gap-3 border-t border-brand-300 pt-6"
      >
        <h2 id="journey-heading" className="text-h2 text-brand-950">
          My Journey
        </h2>
        <p className="text-h5 rounded-sm border border-brand-300 bg-brand-100 px-2 text-brand-950">
          Coming soon
        </p>
        <p className="text-body max-w-xl text-brand-800">
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
