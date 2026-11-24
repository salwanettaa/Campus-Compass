/**
 * Knowledge Hub types. They mirror the tables `guides` and `experiences`
 * (docs/TECH_AND_DATABASE.md) so the mock data layer can be swapped for
 * Supabase queries without UI changes.
 */

export const GUIDE_CATEGORIES = [
  "academic_survival",
  "social_community",
  "administrative_guide",
  "campus_essentials",
  "scholarship_growth",
  "career_preparation",
] as const;
export type GuideCategory = (typeof GUIDE_CATEGORIES)[number];

/** One row of the table `guides` (only published guides are ever shown). */
export type GuideRow = {
  id: string;
  /** NULL for general guides that apply to every campus. */
  campus_id: string | null;
  program_id: string | null;
  title: string;
  category: GuideCategory;
  is_general: boolean;
  content_raw: string;
  source_type: string;
  source_reference: string | null;
  source_url: string | null;
  last_verified_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

/** One row of the table `experiences`. */
export type ExperienceRow = {
  id: string;
  campus_id: string;
  program_id: string;
  author_id: string | null;
  title: string;
  semester_context: number | null;
  situation: string;
  challenge: string;
  solution: string;
  result: string;
  advice_for_juniors: string;
  tags: string[];
  is_verified_contributor: boolean;
  helpful_count: number;
  created_at: string;
};

export type DataResult<T> =
  | { ok: true; data: T }
  | { ok: false; message: string };
