import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { MessageSquareDashed } from "lucide-react";
import { PostCard } from "@/components/community/post-card";
import { PostFilter } from "@/components/community/post-filter";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { listFeed, parseSimulation } from "@/lib/community/data";
import {
  applyFeed,
  buildFeedQuery,
  parseFeedParams,
} from "@/lib/community/feed";

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
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 border-b border-brand-950/15 pb-5">
        <p className="font-mono text-[10px] tracking-[0.16em] text-brand-700">
          STUDENT LIFE / 01
        </p>
        <h1 className="text-4xl leading-tight font-semibold tracking-[-0.05em] text-brand-950">
          Community
        </h1>
        <p className="text-body max-w-xl text-brand-800">
          Questions, lived experience, and practical answers from students.
        </p>
      </header>

      <Alert variant="info">
        You are viewing sample posts. Live community content is coming soon.
      </Alert>

      <Suspense fallback={<div className="h-24" aria-hidden="true" />}>
        <PostFilter />
      </Suspense>

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
          className="flex flex-col items-center gap-3 border border-brand-950/10 border-l-2 border-l-brand-300 bg-paper-raised p-8 text-center"
        >
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
            <MessageSquareDashed className="size-6" aria-hidden="true" />
          </span>
          <h2 id="empty-heading" className="text-h3 text-brand-950">
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
              className="text-h5 text-brand-800 underline underline-offset-4"
            >
              Clear filters
            </Link>
          ) : null}
        </section>
      ) : (
        <ul className="flex flex-col gap-4" aria-label="Posts">
          {items.map((item) => (
            <li key={item.post.id}>
              <PostCard item={item} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
