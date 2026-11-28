import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { CommentThread } from "@/components/community/comment-thread";
import { HelpfulButton } from "@/components/community/helpful-button";
import { SavePostButton } from "@/components/community/save-post-button";
import { TypeBadge } from "@/components/community/type-badge";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { getThread, parseSimulation } from "@/lib/community/data";
import { categoryLabel, formatRelativeTime } from "@/lib/community/format";

export const metadata: Metadata = { title: "Post" };

type SearchParams = Record<string, string | string[] | undefined>;

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { id } = await params;
  const raw = await searchParams;
  const simulation = parseSimulation(
    Array.isArray(raw.mock) ? raw.mock[0] : raw.mock,
  );

  const result = await getThread(id, simulation);

  if (!result.ok) {
    return (
      <main className="flex flex-col items-start gap-3">
        <Alert variant="error" title="We could not load this post">
          {result.message} Please try again.
        </Alert>
        <ButtonLink href={`/community/${id}`} variant="outline" size="sm">
          Try again
        </ButtonLink>
      </main>
    );
  }
  if (!result.data) notFound();

  const { post, viewerHelpful } = result.data.post;

  return (
    <main className="flex w-full flex-col gap-6">
      <Link
        href="/community"
        className="tap text-h5 inline-flex w-fit items-center gap-2 rounded-md text-brand-800 hover:underline focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Community
      </Link>

      <article className="flex flex-col gap-4 border-b border-brand-300 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <TypeBadge type={post.post_type} />
          <span className="text-caption text-brand-800">
            {categoryLabel(post.category)}
          </span>
          {post.has_accepted_answer ? (
            <span className="text-caption inline-flex items-center gap-1 font-medium text-emerald-800">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Answered
            </span>
          ) : null}
        </div>
        <h1 className="text-h1 break-words text-brand-950">
          {post.title}
        </h1>
        <p className="text-caption border-b border-brand-950/10 pb-4 text-brand-800">
          {post.author_display_name ?? "Unknown author"} ·{" "}
          <time dateTime={post.created_at}>
            {formatRelativeTime(post.created_at)}
          </time>
        </p>
        <p className="text-lead max-w-2xl whitespace-pre-line text-brand-950">
          {post.content}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <HelpfulButton
            initialCount={post.helpful_count}
            initialActive={viewerHelpful}
            target="post"
          />
          <SavePostButton postId={post.id} postTitle={post.title} showLabel />
        </div>
      </article>

      <CommentThread
        comments={result.data.comments}
        helpfulCommentIds={result.data.helpfulCommentIds}
      />
    </main>
  );
}
