/**
 * SAMPLE DATA ONLY. Synthetic text, not real campus rules. Do not treat any
 * deadline, requirement, or procedure below as official information.
 */
import type { ExperienceRow, GuideRow } from "./types";

const DAY = 86_400_000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY).toISOString();

const CAMPUS_ID = "00000000-0000-4000-8000-000000000001";
const PROGRAM_ID = "00000000-0000-4000-8000-000000000011";

function guide(
  n: number,
  fields: Pick<
    GuideRow,
    "title" | "category" | "content_raw" | "source_type" | "last_verified_at"
  > &
    Partial<GuideRow>,
): GuideRow {
  return {
    id: `40000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
    campus_id: null,
    program_id: null,
    is_general: true,
    source_reference: null,
    source_url: null,
    is_published: true,
    created_at: fields.last_verified_at,
    updated_at: fields.last_verified_at,
    ...fields,
  };
}

export const MOCK_GUIDES: GuideRow[] = [
  guide(1, {
    title: "How to plan your semester course load",
    category: "academic_survival",
    source_type: "official_campus_source",
    source_reference: "Sample Academic Handbook, chapter 3",
    last_verified_at: daysAgo(20),
    content_raw:
      "Start from your study plan and list the courses you must take this semester.\n\nCheck prerequisites before registering, and keep a lighter load if you work part-time.\n\nTalk to your academic advisor if two courses clash or you want to take extra credits.",
  }),
  guide(2, {
    title: "Building a weekly study routine that lasts",
    category: "academic_survival",
    source_type: "curated_guide",
    last_verified_at: daysAgo(60),
    content_raw:
      "Block fixed study slots in your calendar, and keep them short but regular.\n\nReview lecture notes within 24 hours, then practice with past questions one or two weeks before exams.\n\nStudy groups work best with three or four people and a clear agenda.",
  }),
  guide(3, {
    title: "Finding and joining a student organization",
    category: "social_community",
    source_type: "curated_guide",
    last_verified_at: daysAgo(45),
    content_raw:
      "Visit the organization fair, or ask senior students about activity levels.\n\nStart with one organization and measure the weekly time it takes before joining a second.",
  }),
  guide(4, {
    title: "Course registration step by step",
    category: "administrative_guide",
    source_type: "official_campus_source",
    source_reference: "Sample Registrar Office notice",
    source_url: "https://example.com/sample-registration",
    last_verified_at: daysAgo(10),
    content_raw:
      "Log in to the academic portal on the registration date for your cohort.\n\nSelect courses from your study plan, confirm the schedule, and save a copy of the confirmation.\n\nIf the portal shows an error, contact the faculty office within the registration period.",
  }),
  guide(5, {
    title: "Where to find campus services and facilities",
    category: "campus_essentials",
    source_type: "official_campus_source",
    source_reference: "Sample Campus Map and Services page",
    last_verified_at: daysAgo(300),
    content_raw:
      "The library, health clinic, and student affairs office are listed on the campus services page.\n\nOpening hours change during exam weeks, so check the notice board.",
  }),
  guide(6, {
    title: "Preparing a scholarship application",
    category: "scholarship_growth",
    source_type: "curated_guide",
    source_reference: "Compiled from sample senior experiences",
    last_verified_at: daysAgo(35),
    content_raw:
      "Read the official announcement first, and list every required document.\n\nAsk for recommendation letters at least two weeks ahead.\n\nAlways confirm the latest requirements on the official page before submitting.",
  }),
  guide(7, {
    title: "Getting ready for your first internship search",
    category: "career_preparation",
    source_type: "curated_guide",
    last_verified_at: daysAgo(80),
    content_raw:
      "Update your CV with coursework and projects, and ask a lecturer or senior to review it.\n\nStart with companies that list junior roles, and keep a simple tracking sheet of applications.",
  }),
  guide(8, {
    title: "Draft: exam retake rules",
    category: "administrative_guide",
    source_type: "official_campus_source",
    last_verified_at: daysAgo(5),
    is_published: false,
    content_raw: "Unpublished draft. Must never appear in the Knowledge Hub.",
  }),
];

export const MOCK_EXPERIENCES: ExperienceRow[] = [
  {
    id: "50000000-0000-4000-8000-000000000001",
    campus_id: CAMPUS_ID,
    program_id: PROGRAM_ID,
    author_id: "20000000-0000-4000-8000-000000000001",
    title: "Surviving my first semester with a heavy course load",
    semester_context: 1,
    situation:
      "I registered for the maximum credits because everything looked interesting.",
    challenge:
      "By week five I was behind on two courses and sleeping very little.",
    solution:
      "I dropped one elective within the allowed period and made a weekly plan.",
    result: "My grades recovered and I finished the semester with time to rest.",
    advice_for_juniors:
      "Start with a realistic load. You can always add courses later.",
    tags: ["course-load", "first-semester"],
    is_verified_contributor: true,
    helpful_count: 14,
    created_at: daysAgo(25),
  },
  {
    id: "50000000-0000-4000-8000-000000000002",
    campus_id: CAMPUS_ID,
    program_id: PROGRAM_ID,
    author_id: "20000000-0000-4000-8000-000000000002",
    title: "How I found my study group in semester 3",
    semester_context: 3,
    situation: "I studied alone and felt stuck on difficult topics.",
    challenge: "I did not know anyone in my class outside of my dorm.",
    solution:
      "I asked two classmates to practice questions together after lectures.",
    result: "We now meet weekly and our understanding improved a lot.",
    advice_for_juniors: "Ask early. Most people are happy to study together.",
    tags: ["study-group"],
    is_verified_contributor: false,
    helpful_count: 6,
    created_at: daysAgo(70),
  },
];
