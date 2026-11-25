import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PostCard } from "@/components/community/post-card";
import { PostFilter } from "@/components/community/post-filter";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { listFeed, parseSimulation } from "@/lib/community/data";
import {
  applyFeed,
  buildFeedQuery,
  parseFeedParams,
} from "@/lib/community/feed";
import { pluralize } from "@/lib/community/format";

export const metadata: Metadata = { title: "Community" };

type SearchParams = Record<string, string | string[] | undefined>;

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;
  const params = parseFeedParams(raw);
  const simulation = parseSimulation(
    Array.isArray(raw.mock) ? raw.mock[0] : raw.mock,
  );

  const result = await listFeed(simulation);
  const items = result.ok ? applyFeed(result.data, params) : [];
  const isFiltered = params.type !== null || params.sort === "unanswered";

  return (
    <main className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Community"
        description="Questions, lived experience, and practical answers from students."
      />

      <Alert variant="info">
        You are viewing sample posts. Live community content is coming soon.
      </Alert>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_15rem] xl:items-start xl:gap-10">
        <div className="xl:order-2 xl:sticky xl:top-6">
          <Suspense fallback={<div className="h-24" aria-hidden="true" />}>
            <PostFilter />
          </Suspense>
        </div>

        <div className="min-w-0">
          {!result.ok ? (
            <div className="flex flex-col items-start gap-3">
              <Alert variant="error" title="We could not load the feed">
                {result.message} Please try again.
              </Alert>
              <ButtonLink
                href={`/community${buildFeedQuery(params)}`}
                variant="outline"
                size="sm"
              >
                Try again
              </ButtonLink>
            </div>
          ) : items.length === 0 ? (
            <section
              aria-labelledby="empty-heading"
              className="flex flex-col items-start gap-3 border-y border-brand-300 py-10"
            >
              <h2 id="empty-heading" className="text-h2 text-brand-950">
                {isFiltered ? "No posts match these filters" : "No posts yet"}
              </h2>
              <p className="text-body max-w-md text-brand-800">
                {isFiltered
                  ? "Try another sort or post type to see more."
                  : "When students start posting, you will see their questions and experiences here."}
              </p>
              {isFiltered ? (
                <Link
                  href="/community"
                  className="text-h5 inline-flex min-h-11 items-center text-brand-700 underline underline-offset-4"
                >
                  Clear filters
                </Link>
              ) : null}
            </section>
          ) : (
            <section aria-labelledby="posts-heading">
              <h2
                id="posts-heading"
                className="text-caption border-b border-brand-300 pb-3 text-brand-800"
              >
                {pluralize(items.length, "post")} in this view
              </h2>
              <ul className="mt-4 flex flex-col gap-4" aria-label="Posts">
                {items.map((item) => (
                  <li key={item.post.id}>
                    <PostCard item={item} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
