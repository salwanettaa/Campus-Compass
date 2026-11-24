/**
 * SAMPLE DATA ONLY. Synthetic text, not real students or real campus rules.
 * Used until the Community slice is connected to Supabase (see data.ts).
 */
import type { CommentRow, PostRow } from "./types";

const HOUR = 3_600_000;
const ago = (hours: number) => new Date(Date.now() - hours * HOUR).toISOString();

const CAMPUS_ID = "00000000-0000-4000-8000-000000000001";
const PROGRAM_ID = "00000000-0000-4000-8000-000000000011";

function post(
  n: number,
  fields: Partial<PostRow> &
    Pick<
      PostRow,
      "post_type" | "category" | "title" | "content" | "created_at"
    >,
): PostRow {
  return {
    id: `10000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
    campus_id: CAMPUS_ID,
    program_id: PROGRAM_ID,
    author_id: `20000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
    author_display_name: "Sample Student",
    tags: [],
    is_anonymous: false,
    helpful_count: 0,
    has_accepted_answer: false,
    status: "published",
    updated_at: fields.created_at,
    ...fields,
  };
}

export const MOCK_POSTS: PostRow[] = [
  post(1, {
    post_type: "question",
    category: "administrative",
    title: "How do I fix a clash between two courses in my study plan?",
    content:
      "Two of my required courses are scheduled at the same time this semester. I am not sure whether I should talk to my academic advisor first or go straight to the faculty office. Has anyone dealt with this before?",
    tags: ["study-plan", "registration"],
    author_display_name: "Sample Student A",
    helpful_count: 12,
    has_accepted_answer: true,
    created_at: ago(30),
  }),
  post(2, {
    post_type: "experience",
    category: "academic",
    title: "What helped me survive my first midterms",
    content:
      "I started with a weekly plan, formed a small study group, and practiced old exam questions two weeks ahead. The group was the biggest difference because we could explain topics to each other.",
    tags: ["midterms", "study-methods"],
    author_display_name: "Sample Senior B",
    helpful_count: 24,
    created_at: ago(96),
  }),
  post(3, {
    post_type: "question",
    category: "social",
    title: "Which student organizations are friendly to first-year students?",
    content:
      "I would like to join one organization this semester but I do not want to overcommit. What should I look for, and how many hours per week is realistic?",
    tags: ["organizations"],
    author_display_name: "Anonymous Student",
    is_anonymous: true,
    author_id: null,
    helpful_count: 3,
    created_at: ago(5),
  }),
  post(4, {
    post_type: "guide",
    category: "administrative",
    title: "Step-by-step: preparing documents for a scholarship application",
    content:
      "Check the official announcement first, then prepare your transcript, a motivation letter, and a recommendation letter. Ask for the recommendation at least two weeks before the deadline. Always confirm the latest requirements on the official page.",
    tags: ["scholarship", "documents"],
    author_display_name: "Sample Senior C",
    helpful_count: 31,
    created_at: ago(200),
  }),
  post(5, {
    post_type: "opportunity",
    category: "opportunity",
    title: "Open call: student research assistant for a data project",
    content:
      "A lecturer in the faculty is looking for two student assistants for a small data analysis project. Basic spreadsheet skills are enough. Details are in the faculty announcement.",
    tags: ["research", "assistant"],
    author_display_name: "Sample Curator",
    helpful_count: 8,
    created_at: ago(52),
  }),
  post(6, {
    post_type: "question",
    category: "personal",
    title: "How do you manage your time between classes and part-time work?",
    content:
      "My schedule is getting heavy. I would love to hear how others split their week without burning out.",
    tags: ["time-management"],
    author_display_name: "Sample Student D",
    helpful_count: 1,
    created_at: ago(2),
  }),
  post(7, {
    post_type: "experience",
    category: "facilities",
    title: "Quiet places to study on campus (my honest list)",
    content:
      "The library's second floor is calm in the morning. The faculty lounge fills up after lunch. Bring headphones either way.",
    tags: ["facilities", "study-spots"],
    author_display_name: "Sample Student E",
    helpful_count: 15,
    created_at: ago(140),
  }),
  post(8, {
    post_type: "question",
    category: "academic",
    title: "Is it normal to feel behind after the first month?",
    content:
      "Everyone seems to understand the lectures faster than me. Is this common, and when should I ask for help?",
    tags: ["wellbeing"],
    author_display_name: "Anonymous Student",
    is_anonymous: true,
    author_id: null,
    helpful_count: 6,
    created_at: ago(18),
  }),
];

function comment(
  n: number,
  postN: number,
  fields: Partial<CommentRow> &
    Pick<CommentRow, "content" | "created_at">,
): CommentRow {
  return {
    id: `30000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
    post_id: `10000000-0000-4000-8000-${String(postN).padStart(12, "0")}`,
    campus_id: CAMPUS_ID,
    parent_comment_id: null,
    author_id: `20000000-0000-4000-8000-${String(100 + n).padStart(12, "0")}`,
    author_display_name: "Sample Student",
    is_anonymous: false,
    is_accepted_answer: false,
    helpful_count: 0,
    status: "published",
    ...fields,
  };
}

const C = (n: number) =>
  `30000000-0000-4000-8000-${String(n).padStart(12, "0")}`;

export const MOCK_COMMENTS: CommentRow[] = [
  comment(1, 1, {
    author_display_name: "Sample Senior B",
    content:
      "Talk to your academic advisor first. They can tell you whether the clash is allowed and which form the faculty office needs.",
    helpful_count: 9,
    is_accepted_answer: true,
    created_at: ago(28),
  }),
  comment(2, 1, {
    parent_comment_id: C(1),
    author_display_name: "Sample Student A",
    content: "Thank you! I will book a slot this week.",
    created_at: ago(27),
  }),
  comment(3, 1, {
    parent_comment_id: C(2),
    author_display_name: "Sample Senior B",
    content: "Bring a printed copy of your study plan, it speeds things up.",
    helpful_count: 2,
    created_at: ago(26),
  }),
  comment(4, 1, {
    author_display_name: "Sample Student F",
    content: "The faculty office also posts the form on its notice board.",
    helpful_count: 1,
    created_at: ago(25),
  }),
  comment(5, 2, {
    author_display_name: "Sample Student G",
    content: "The study group tip is gold. We booked a room every Thursday.",
    helpful_count: 4,
    created_at: ago(90),
  }),
  comment(6, 4, {
    author_display_name: "Anonymous Student",
    is_anonymous: true,
    author_id: null,
    content: "Remember to check the file size limits on the portal.",
    helpful_count: 5,
    created_at: ago(180),
  }),
  comment(7, 7, {
    author_display_name: "Sample Student H",
    content: "Thanks, the second floor really is quieter.",
    created_at: ago(120),
  }),
  comment(8, 8, {
    author_display_name: "Sample Senior C",
    content: "Very common. Ask your lecturer during office hours early.",
    helpful_count: 7,
    created_at: ago(16),
  }),
];

/** Pretend the signed-in user already voted for these. */
export const MOCK_HELPFUL_POST_IDS: string[] = [MOCK_POSTS[1].id];
export const MOCK_HELPFUL_COMMENT_IDS: string[] = [C(1)];
