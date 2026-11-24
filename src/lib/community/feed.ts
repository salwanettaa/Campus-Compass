import { POST_TYPES, type FeedItem, type PostType } from "./types";

export const SORT_MODES = [
  { value: "for-you", label: "For You" },
  { value: "new", label: "New" },
  { value: "helpful", label: "Helpful" },
  { value: "unanswered", label: "Unanswered" },
] as const;

export type SortMode = (typeof SORT_MODES)[number]["value"];

export const DEFAULT_SORT: SortMode = "for-you";

export const TYPE_LABELS: Record<PostType, string> = {
  question: "Question",
  experience: "Experience",
  guide: "Guide",
  opportunity: "Opportunity",
};

export type FeedParams = {
  sort: SortMode;
  /** `null` means all types. */
  type: PostType | null;
};

type RawParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Reads `?sort=` and `?type=` and ignores any value that is not allowed. */
export function parseFeedParams(raw: RawParams): FeedParams {
  const sort = first(raw.sort);
  const type = first(raw.type);
  return {
    sort:
      SORT_MODES.find((mode) => mode.value === sort)?.value ?? DEFAULT_SORT,
    type: POST_TYPES.find((value) => value === type) ?? null,
  };
}

/** Builds the query string for the filter links; defaults are left out. */
export function buildFeedQuery(params: FeedParams): string {
  const query = new URLSearchParams();
  if (params.sort !== DEFAULT_SORT) query.set("sort", params.sort);
  if (params.type) query.set("type", params.type);
  const text = query.toString();
  return text ? `?${text}` : "";
}

const DAY_MS = 86_400_000;

function createdAt(item: FeedItem) {
  return Date.parse(item.post.created_at);
}

/** "For You" ranking: helpful posts first, with older posts fading out. */
function forYouScore(item: FeedItem, now: number) {
  const ageDays = Math.max(0, (now - createdAt(item)) / DAY_MS);
  return (item.post.helpful_count + item.commentCount + 1) / (1 + ageDays / 7);
}

/** Pure filter and sort for the feed, so it can be tested without a database. */
export function applyFeed(
  items: readonly FeedItem[],
  params: FeedParams,
  now: number = Date.now(),
): FeedItem[] {
  let result = items.filter((item) => item.post.status === "published");

  if (params.type) {
    result = result.filter((item) => item.post.post_type === params.type);
  }

  if (params.sort === "unanswered") {
    result = result.filter(
      (item) =>
        item.post.post_type === "question" &&
        !item.post.has_accepted_answer &&
        item.commentCount === 0,
    );
  }

  const sorted = [...result];
  switch (params.sort) {
    case "helpful":
      sorted.sort(
        (a, b) =>
          b.post.helpful_count - a.post.helpful_count ||
          createdAt(b) - createdAt(a),
      );
      break;
    case "for-you":
      sorted.sort(
        (a, b) =>
          forYouScore(b, now) - forYouScore(a, now) ||
          createdAt(b) - createdAt(a),
      );
      break;
    default:
      sorted.sort((a, b) => createdAt(b) - createdAt(a));
  }
  return sorted;
}
