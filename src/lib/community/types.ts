/**
 * Community types. They mirror the columns of the views `v_posts` and
 * `v_comments` (docs/TECH_AND_DATABASE.md, section 2) so that swapping the mock
 * data layer for Supabase queries needs no change in the UI.
 */

export const POST_TYPES = [
  "question",
  "experience",
  "guide",
  "opportunity",
] as const;
export type PostType = (typeof POST_TYPES)[number];

export type ContentStatus =
  | "published"
  | "under_review"
  | "reported"
  | "archived";

/** One row of the view `v_posts`. */
export type PostRow = {
  id: string;
  campus_id: string;
  program_id: string | null;
  /** NULL when the post is anonymous and the viewer is not the author. */
  author_id: string | null;
  /** The view already masks anonymous authors. Show it as is. */
  author_display_name: string | null;
  post_type: PostType;
  category: string;
  title: string;
  content: string;
  tags: string[];
  is_anonymous: boolean;
  helpful_count: number;
  has_accepted_answer: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
};

/** One row of the view `v_comments`. */
export type CommentRow = {
  id: string;
  post_id: string;
  campus_id: string;
  parent_comment_id: string | null;
  author_id: string | null;
  author_display_name: string | null;
  content: string;
  is_anonymous: boolean;
  is_accepted_answer: boolean;
  helpful_count: number;
  status: ContentStatus;
  created_at: string;
};

/** A post in the feed plus the data the feed needs but `v_posts` does not hold. */
export type FeedItem = {
  post: PostRow;
  /**
   * Number of published comments. `v_posts` has no such column, so the real
   * data layer must count it from `v_comments` (no new column is allowed).
   */
  commentCount: number;
  /** Whether the signed-in user already voted (`votes` is private per user). */
  viewerHelpful: boolean;
};

export type Thread = {
  post: FeedItem;
  comments: CommentRow[];
  /** Ids of comments the signed-in user already marked as helpful. */
  helpfulCommentIds: string[];
};

export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };
