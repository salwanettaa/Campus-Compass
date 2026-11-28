import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, MessagesSquare } from "lucide-react";
import { CompassRing } from "@/components/home/compass-ring";
import { SavedItemsSection } from "@/components/home/saved-items-section";
import { JourneySummaryCard } from "@/components/journey/journey-summary-card";
import { MyTasksPanel } from "@/components/tasks/my-tasks-panel";
import { RouteMap } from "@/components/journey/route-map";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { getSavedBookmarkIds } from "@/lib/bookmarks/data";
import { categoryLabel } from "@/lib/community/format";
import { listFeed } from "@/lib/community/data";
import {
  ADAPTATION_AREAS,
  MAIN_CHALLENGES,
  normalizeAdaptationProfile,
  type AdaptationArea,
} from "@/lib/constants/onboarding";
import { getUserJourneyData } from "@/lib/journey/data";
import { categoryName } from "@/lib/knowledge/categories";
import { listGuides } from "@/lib/knowledge/data";
import type { GuideCategory } from "@/lib/knowledge/types";
import { createClient } from "@/lib/supabase/server";
import { getUserTasks } from "@/lib/tasks/data";

export const metadata: Metadata = { title: "Home" };

/** The Knowledge Hub guide category that best matches each adaptation area. */
const AREA_GUIDES: Record<AdaptationArea, GuideCategory> = {
  social: "social_community",
  academic: "academic_survival",
  internship: "career_preparation",
  scholarship: "scholarship_growth",
  competition: "scholarship_growth",
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      "display_name, campus_id, program_id, semester, adaptation_area, main_challenge",
    )
    .eq("id", user?.id ?? "")
    .maybeSingle();

  if (profileError) return <HomeLoadError />;

  const normalized = normalizeAdaptationProfile(
    profile?.adaptation_area,
    profile?.main_challenge,
  );

  const [
    campusRes,
    programRes,
    journeyRes,
    tasksRes,
    guidesRes,
    feedRes,
    savedBookmarks,
  ] = await Promise.all([
    profile?.campus_id
      ? supabase
          .from("campuses")
          .select("name")
          .eq("id", profile.campus_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    profile?.program_id
      ? supabase
          .from("programs")
          .select("name")
          .eq("id", profile.program_id)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    getUserJourneyData(normalized.area, normalized.challenge),
    getUserTasks(),
    listGuides(),
    listFeed(),
    getSavedBookmarkIds(),
  ]);

  // Missing profile data must not look like "not set": show an error instead.
  if (campusRes.error || programRes.error) return <HomeLoadError />;

  const area = ADAPTATION_AREAS.find((a) => a.value === normalized.area);
  const challenge = MAIN_CHALLENGES.find(
    (c) => c.value === normalized.challenge,
  );
  const campusDetails = [
    campusRes.data?.name,
    programRes.data?.name,
    profile?.semester ? `Semester ${profile.semester}` : null,
  ].filter(Boolean);

  const guideCategory = AREA_GUIDES[normalized.area];
  const allGuides = guidesRes.ok ? guidesRes.data : [];
  const recommendedGuides = allGuides
    .filter((guide) => guide.category === guideCategory)
    .slice(0, 3);

  const allPosts = feedRes.ok ? feedRes.data : [];
  const sortedDiscussions = [...allPosts]
    .sort((a, b) => {
      const aMatch = a.post.category === normalized.area ? 1 : 0;
      const bMatch = b.post.category === normalized.area ? 1 : 0;
      if (aMatch !== bMatch) return bMatch - aMatch;
      return Date.parse(b.post.created_at) - Date.parse(a.post.created_at);
    })
    .slice(0, 3);

  const { journey } = journeyRes;

  const upNext = journey.nextAction;
  const upNextStage = upNext
    ? journey.stages.find((stage) => stage.id === upNext.stageId)
    : null;
  const card =
    "flex min-w-0 flex-col gap-3 rounded-xl border border-brand-300 bg-paper-raised p-5";
  const cardLink =
    "inline-flex min-h-9 shrink-0 items-center rounded-lg px-2 text-caption font-semibold text-brand-700 hover:bg-brand-100";

  return (
    <main className="flex w-full flex-col gap-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-h1 break-words text-brand-950">
            Welcome back, {profile?.display_name ?? "Student"}.
          </h1>
          {campusDetails.length > 0 ? (
            <p className="text-body text-brand-800">
              {campusDetails.join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/community" variant="outline" size="sm">
            <MessagesSquare className="size-4" aria-hidden="true" />
            Ask the community
          </ButtonLink>
          <ButtonLink
            href={`/knowledge?category=${guideCategory}`}
            variant="outline"
            size="sm"
            className="h-auto min-h-11 py-2 text-center whitespace-normal"
          >
            <BookOpen className="size-4 shrink-0" aria-hidden="true" />
            Read {categoryName(guideCategory)}
          </ButtonLink>
        </div>
      </header>

      {/* Overview: the focus, the one next step, and the whole route. */}
      <section
        aria-labelledby="focus-heading"
        className="grid items-center gap-x-6 gap-y-5 overflow-hidden rounded-xl border border-brand-300 bg-paper-raised px-5 pt-5 sm:px-6 md:grid-cols-[11rem_minmax(0,1fr)] xl:grid-cols-[11rem_minmax(0,1fr)_minmax(0,22rem)]"
      >
        <div className="mx-auto w-full max-w-44">
          <CompassRing area={normalized.area} />
        </div>
        <div className="min-w-0">
          <h2 id="focus-heading" className="text-h2 text-brand-950">
            {journey.definition.title}
          </h2>
          <p className="text-body mt-1 text-brand-800">
            {area?.description ?? journey.definition.description}
          </p>
          {challenge ? (
            <p className="text-body mt-2 text-brand-800">
              Main challenge:{" "}
              <span className="font-semibold text-brand-950">
                {challenge.label}
              </span>
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 rounded-xl border border-brand-600/30 bg-brand-100 p-4 md:col-span-2 xl:col-span-1">
          <div>
            <p className="text-caption font-semibold text-brand-700">
              {upNext ? "Your next step" : "Journey cleared"}
            </p>
            <p className="text-h4 mt-1 text-brand-950">
              {upNext
                ? upNext.title
                : "Every step is resolved. Write down what you learned."}
            </p>
          </div>
          <ButtonLink href="/journey" className="w-full">
            Continue Journey
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </div>
        <RouteMap
          journey={journey}
          className="-mx-5 w-auto border-t border-brand-300 bg-frost px-5 py-4 sm:-mx-6 sm:px-6 md:col-span-2 xl:col-span-3"
        />
      </section>

      {/* Rows of two: each pair shares a height, so the edges line up. */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <JourneySummaryCard
          journey={journey}
          schemaReady={journeyRes.schemaReady}
        />

        <MyTasksPanel
          initialTasks={tasksRes.tasks}
          defaultCategory={normalized.area}
          schemaReady={tasksRes.schemaReady}
          loadError={tasksRes.error}
          suggestions={
            upNextStage?.items
              .filter((item) => item.status === "pending" && !item.linkedTaskId)
              .slice(0, 2)
              .map((item) => item.title) ?? []
          }
        />

        <section aria-labelledby="recommended-heading" className={card}>
          <div className="flex items-center justify-between gap-3">
            <h2 id="recommended-heading" className="text-h3 text-brand-950">
              Recommended for You
            </h2>
            <Link href={`/knowledge?category=${guideCategory}`} className={cardLink}>
              View all
              <span className="sr-only"> in Knowledge Hub</span>
            </Link>
          </div>

          {recommendedGuides.length > 0 ? (
            <ul className="divide-y divide-brand-300 border-t border-brand-300">
              {recommendedGuides.map((guide) => (
                <li key={guide.id}>
                  <Link
                    href={`/knowledge/${guide.id}`}
                    className="group flex items-center justify-between gap-4 rounded-lg px-2 py-3 transition-colors duration-150 hover:bg-brand-100"
                  >
                    <div className="min-w-0">
                      <p className="text-caption text-brand-700">
                        {categoryName(guide.category)}
                      </p>
                      <h3 className="text-h4 text-brand-950">{guide.title}</h3>
                      <p className="text-body line-clamp-1 text-brand-800">
                        {guide.content_raw}
                      </p>
                    </div>
                    <ArrowRight
                      className="size-4 shrink-0 text-brand-700"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body border-t border-brand-300 pt-4 text-brand-800">
              No guides found for {categoryName(guideCategory)} yet.{" "}
              <Link href="/knowledge" className="text-brand-700 underline">
                Explore Knowledge Hub
              </Link>
              .
            </p>
          )}
        </section>

        <section aria-labelledby="discussions-heading" className={card}>
          <div className="flex items-center justify-between gap-3">
            <h2 id="discussions-heading" className="text-h3 text-brand-950">
              Latest Discussions
            </h2>
            <Link href="/community" className={cardLink}>
              Open Community
            </Link>
          </div>

          {sortedDiscussions.length > 0 ? (
            <ul className="divide-y divide-brand-300 border-t border-brand-300">
              {sortedDiscussions.map(({ post, commentCount }) => (
                <li key={post.id}>
                  <Link
                    href={`/community/${post.id}`}
                    className="flex items-center justify-between gap-4 px-2 py-3 transition-colors rounded-lg hover:bg-brand-100"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-caption text-brand-700">
                          {categoryLabel(post.category)}
                        </span>
                        <span className="text-caption text-brand-800">
                          · {commentCount}{" "}
                          {commentCount === 1 ? "comment" : "comments"}
                        </span>
                      </div>
                      <p className="text-h5 truncate text-brand-950">
                        {post.title}
                      </p>
                    </div>
                    <ArrowRight
                      className="size-4 shrink-0 text-brand-700"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-brand-800">
              No discussions available right now.
            </p>
          )}
        </section>
      </div>

      {/* Saved Items from Knowledge Hub & Community */}
      <SavedItemsSection
        guides={allGuides}
        posts={allPosts.map((item) => item.post)}
        dbSavedGuideIds={savedBookmarks.guideIds}
        dbSavedPostIds={savedBookmarks.postIds}
      />
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
