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

export type ProgramOption = {
  id: string;
  name: string;
  shortName: string;
  faculty: string;
  code: string;
  isPilot?: boolean;
};

export const PILOT_PROGRAM: ProgramOption = {
  id: "prog-d4-tri",
  name: "D4 Teknologi Rekayasa Internet",
  shortName: "D4 TRI (Vokasi)",
  faculty: "Sekolah Vokasi UGM",
  code: "TRI",
  isPilot: true,
};

export const AVAILABLE_PROGRAMS: readonly ProgramOption[] = [
  PILOT_PROGRAM,
  {
    id: "prog-d4-trpl",
    name: "D4 Teknologi Rekayasa Perangkat Lunak",
    shortName: "D4 TRPL (Vokasi)",
    faculty: "Sekolah Vokasi UGM",
    code: "TRPL",
    isPilot: false,
  },
  {
    id: "prog-s1-ti",
    name: "S1 Teknologi Informasi",
    shortName: "S1 TI (Teknik)",
    faculty: "Fakultas Teknik UGM",
    code: "TI",
    isPilot: false,
  },
  {
    id: "prog-s1-ilkom",
    name: "S1 Ilmu Komputer",
    shortName: "S1 Ilkom (FMIPA)",
    faculty: "Fakultas MIPA UGM",
    code: "ILKOM",
    isPilot: false,
  },
  {
    id: "prog-s1-mn",
    name: "S1 Manajemen",
    shortName: "S1 Manajemen (FEB)",
    faculty: "Fakultas Ekonomika dan Bisnis UGM",
    code: "MN",
    isPilot: false,
  },
] as const;

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
