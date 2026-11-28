"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, MessagesSquare } from "lucide-react";
import { categoryLabel } from "@/lib/community/format";
import type { PostRow } from "@/lib/community/types";
import { categoryName } from "@/lib/knowledge/categories";
import type { GuideRow } from "@/lib/knowledge/types";

export type SavedItemsSectionProps = {
  guides: GuideRow[];
  posts: PostRow[];
  dbSavedGuideIds: string[];
  dbSavedPostIds: string[];
};

function readLocalIds(prefix: string): string[] {
  const ids: string[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const key = window.localStorage.key(i);
      if (
        key &&
        key.startsWith(prefix) &&
        window.localStorage.getItem(key) === "true"
      ) {
        ids.push(key.slice(prefix.length));
      }
    }
  } catch {
    // Ignore storage access errors.
  }
  return ids;
}

export function SavedItemsSection({
  guides,
  posts,
  dbSavedGuideIds,
  dbSavedPostIds,
}: SavedItemsSectionProps) {
  const [localGuideIds, setLocalGuideIds] = useState<string[]>([]);
  const [localPostIds, setLocalPostIds] = useState<string[]>([]);

  useEffect(() => {
    const sync = () => {
      setLocalGuideIds(readLocalIds("compass_bookmark_"));
      setLocalPostIds(readLocalIds("compass_post_bookmark_"));
    };
    sync();

    window.addEventListener("storage", sync);
    window.addEventListener("compass-bookmark-change", sync);
    window.addEventListener("compass-post-bookmark-change", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("compass-bookmark-change", sync);
      window.removeEventListener("compass-post-bookmark-change", sync);
    };
  }, []);

  const savedGuideSet = new Set([...dbSavedGuideIds, ...localGuideIds]);
  const savedPostSet = new Set([...dbSavedPostIds, ...localPostIds]);

  const savedGuides = guides.filter((g) => savedGuideSet.has(g.id));
  const savedPosts = posts.filter((p) => savedPostSet.has(p.id));
  const totalSaved = savedGuides.length + savedPosts.length;

  return (
    <section
      aria-labelledby="saved-heading"
      className="flex flex-col gap-3 rounded-xl border border-brand-300 bg-paper-raised p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 id="saved-heading" className="text-h3 text-brand-950">
            Saved Items
          </h2>
          {totalSaved > 0 ? (
            <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-caption text-brand-700">
              {totalSaved}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-3 text-caption">
          <Link href="/knowledge" className="tap text-brand-700 hover:underline">
            Knowledge Hub
          </Link>
          <Link href="/community" className="tap text-brand-700 hover:underline">
            Community
          </Link>
        </div>
      </div>

      {totalSaved === 0 ? (
        <p className="rounded-xl border border-dashed border-brand-300 bg-paper p-5 text-body text-brand-800">
          No saved items yet. Bookmark guides in{" "}
          <Link href="/knowledge" className="text-brand-700 underline">
            Knowledge Hub
          </Link>{" "}
          or discussions in{" "}
          <Link href="/community" className="text-brand-700 underline">
            Community
          </Link>{" "}
          to revisit them here.
        </p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {savedGuides.map((guide) => (
            <Link
              key={`guide-${guide.id}`}
              href={`/knowledge/${guide.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-brand-300 bg-paper p-4 transition-colors hover:border-brand-600"
            >
              <div className="flex min-w-0 items-start gap-3">
                <BookOpen
                  className="mt-0.5 size-4 shrink-0 text-brand-700"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-caption text-brand-700">
                    Guide · {categoryName(guide.category)}
                  </p>
                  <p className="text-h5 truncate text-brand-950">
                    {guide.title}
                  </p>
                </div>
              </div>
              <ArrowRight
                className="size-4 shrink-0 text-brand-700"
                aria-hidden="true"
              />
            </Link>
          ))}

          {savedPosts.map((post) => (
            <Link
              key={`post-${post.id}`}
              href={`/community/${post.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-brand-300 bg-paper p-4 transition-colors hover:border-brand-600"
            >
              <div className="flex min-w-0 items-start gap-3">
                <MessagesSquare
                  className="mt-0.5 size-4 shrink-0 text-route-on-dark"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-caption text-brand-800">
                    Community · {categoryLabel(post.category)}
                  </p>
                  <p className="text-h5 truncate text-brand-950">
                    {post.title}
                  </p>
                </div>
              </div>
              <ArrowRight
                className="size-4 shrink-0 text-brand-700"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
