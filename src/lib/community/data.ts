/**
 * Community data layer. The UI only talks to these functions.
 *
 * TODAY: returns sample data from ./mock-data.
 * LATER (Slice 2 with Supabase): replace the bodies, keep the signatures.
 *   - listFeed:  supabase.from("v_posts").select("*").eq("status", "published")
 *                (+ comment counts from v_comments, + the viewer's rows in `votes`)
 *   - getThread: v_posts by id + v_comments by post_id
 * campus_id comes from the signed-in profile on the server, never from client input.
 */
import {
  MOCK_COMMENTS,
  MOCK_HELPFUL_COMMENT_IDS,
  MOCK_HELPFUL_POST_IDS,
  MOCK_POSTS,
} from "./mock-data";
import type { DataResult, FeedItem, Thread } from "./types";

/** Lets us look at the error and empty screens without a database. */
export type Simulation = "error" | "empty" | null;

/** Only honoured outside production, so it can never affect real users. */
export function parseSimulation(value: unknown): Simulation {
  if (process.env.NODE_ENV === "production") return null;
  return value === "error" || value === "empty" ? value : null;
}

const LOAD_ERROR = "We could not load the community right now.";

function toFeedItem(post: (typeof MOCK_POSTS)[number]): FeedItem {
  return {
    post,
    commentCount: MOCK_COMMENTS.filter(
      (c) => c.post_id === post.id && c.status === "published",
    ).length,
    viewerHelpful: MOCK_HELPFUL_POST_IDS.includes(post.id),
  };
}

export async function listFeed(
  simulation: Simulation = null,
): Promise<DataResult<FeedItem[]>> {
  if (simulation === "error") return { ok: false, message: LOAD_ERROR };
  if (simulation === "empty") return { ok: true, data: [] };
  return { ok: true, data: MOCK_POSTS.map(toFeedItem) };
}

/** `data: null` with ok = true means "not found". */
export async function getThread(
  postId: string,
  simulation: Simulation = null,
): Promise<DataResult<Thread | null>> {
  if (simulation === "error") {
    return { ok: false, message: "We could not load this post right now." };
  }
  const post = MOCK_POSTS.find((p) => p.id === postId);
  if (!post || simulation === "empty") return { ok: true, data: null };

  return {
    ok: true,
    data: {
      post: toFeedItem(post),
      comments: MOCK_COMMENTS.filter((c) => c.post_id === postId),
      helpfulCommentIds: MOCK_HELPFUL_COMMENT_IDS,
    },
  };
}
