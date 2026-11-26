/**
 * Knowledge Hub data layer.
 * Connects to Supabase (profiles, campuses, faculties, programs, guides,
 * experiences, bookmarks) when configured and seeded, with safe fallback to
 * sample data when tables have not been populated yet.
 */
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Campus, Faculty, Program } from "@/types/database";
import { MOCK_EXPERIENCES, MOCK_GUIDES } from "./mock-data";
import {
  AVAILABLE_PROGRAMS,
  PILOT_PROGRAM,
  type DataResult,
  type ExperienceRow,
  type GuideRow,
  type KnowledgeContext,
  type ProgramOption,
} from "./types";

/** Lets us look at the error and empty screens without a database. */
export type Simulation = "error" | "empty" | null;

/** Only honoured outside production, so it can never affect real users. */
export function parseSimulation(value: unknown): Simulation {
  if (process.env.NODE_ENV === "production") return null;
  return value === "error" || value === "empty" ? value : null;
}

export type KnowledgeDataResult<T> = DataResult<T> & {
  source?: "supabase" | "mock";
};

function toProgramOption(
  prog: Program,
  faculties: readonly Faculty[],
): ProgramOption {
  const faculty = faculties.find((f) => f.id === prog.faculty_id);
  const facultyLabel = faculty?.code
    ? `${faculty.code}`
    : (faculty?.name ?? "Campus");
  return {
    id: prog.id,
    name: prog.name,
    shortName: `${prog.degree_level === "Undergraduate" ? "S1" : prog.degree_level} ${prog.code} (${facultyLabel})`,
    faculty: faculty?.name ?? "Faculty",
    code: prog.code,
    isPilot: prog.is_pilot,
  };
}

/**
 * Loads the signed-in student's campus, program, all programs under that
 * campus, and saved guide bookmarks from Supabase.
 */
export async function getKnowledgeContext(): Promise<KnowledgeContext> {
  const fallback: KnowledgeContext = {
    source: "mock",
    campusId: null,
    campusName: "Universitas Gadjah Mada",
    myProgram: PILOT_PROGRAM,
    programs: [...AVAILABLE_PROGRAMS],
    bookmarkedGuideIds: [],
  };

  if (!hasSupabaseEnv()) return fallback;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fallback;

    const { data: profile } = await supabase
      .from("profiles")
      .select("campus_id, program_id")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile?.campus_id) return fallback;

    const [campusRes, facultiesRes, programsRes, bookmarksRes] =
      await Promise.all([
        supabase
          .from("campuses")
          .select("id, name, slug, domain, is_active")
          .eq("id", profile.campus_id)
          .maybeSingle(),
        supabase
          .from("faculties")
          .select("id, campus_id, name, code")
          .eq("campus_id", profile.campus_id)
          .order("name"),
        supabase
          .from("programs")
          .select("id, campus_id, faculty_id, name, code, degree_level, is_pilot")
          .eq("campus_id", profile.campus_id)
          .order("name"),
        supabase
          .from("bookmarks")
          .select("guide_id")
          .eq("user_id", user.id)
          .not("guide_id", "is", null),
      ]);

    const campus = campusRes.data as Campus | null;
    const faculties = (facultiesRes.data ?? []) as Faculty[];
    const dbPrograms = (programsRes.data ?? []) as Program[];

    if (dbPrograms.length === 0) return fallback;

    const mappedPrograms = dbPrograms.map((p) => toProgramOption(p, faculties));
    const myProgram =
      mappedPrograms.find((p) => p.id === profile.program_id) ??
      mappedPrograms.find((p) => p.isPilot) ??
      mappedPrograms[0];

    const bookmarkedGuideIds = (bookmarksRes.data ?? [])
      .map((b) => b.guide_id as string | null)
      .filter((id): id is string => Boolean(id));

    return {
      source: "supabase",
      campusId: profile.campus_id,
      campusName: campus?.name ?? "Campus",
      myProgram,
      programs: mappedPrograms,
      bookmarkedGuideIds,
    };
  } catch {
    return fallback;
  }
}

export async function listGuides(
  simulation: Simulation = null,
): Promise<KnowledgeDataResult<GuideRow[]>> {
  if (simulation === "error") {
    return { ok: false, message: "We could not load the guides right now." };
  }
  if (simulation === "empty") return { ok: true, data: [], source: "mock" };

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("is_published", true)
        .order("last_verified_at", { ascending: false });

      if (error) {
        return { ok: false, message: "Unable to load guides from database." };
      }

      if (data && data.length > 0) {
        return { ok: true, data: data as GuideRow[], source: "supabase" };
      }
    } catch {
      // Outside Next request scope (e.g. unit tests) -> fall back to mock.
    }
  }

  return {
    ok: true,
    data: MOCK_GUIDES.filter((g) => g.is_published),
    source: "mock",
  };
}

/** `data: null` with ok = true means "not found" (or not published). */
export async function getGuide(
  id: string,
  simulation: Simulation = null,
): Promise<KnowledgeDataResult<GuideRow | null>> {
  if (simulation === "error") {
    return { ok: false, message: "We could not load this guide right now." };
  }
  if (simulation === "empty") return { ok: true, data: null, source: "mock" };

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("id", id)
        .eq("is_published", true)
        .maybeSingle();

      if (!error && data) {
        return { ok: true, data: data as GuideRow, source: "supabase" };
      }
    } catch {
      // Fall back to sample guides if not in DB or outside request scope.
    }
  }

  const guide = MOCK_GUIDES.find((g) => g.id === id && g.is_published);
  return { ok: true, data: guide ?? null, source: "mock" };
}

export async function listExperiences(
  simulation: Simulation = null,
): Promise<KnowledgeDataResult<ExperienceRow[]>> {
  if (simulation === "error") {
    return {
      ok: false,
      message: "We could not load senior experiences right now.",
    };
  }
  if (simulation === "empty") return { ok: true, data: [], source: "mock" };

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("experiences")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return {
          ok: false,
          message: "Unable to load senior experiences from database.",
        };
      }

      if (data && data.length > 0) {
        return { ok: true, data: data as ExperienceRow[], source: "supabase" };
      }
    } catch {
      // Fall back to mock data outside Next request scope.
    }
  }

  return { ok: true, data: MOCK_EXPERIENCES, source: "mock" };
}
