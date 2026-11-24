/**
 * Knowledge Hub data layer. The UI only talks to these functions.
 *
 * TODAY: sample data from ./mock-data.
 * LATER (Slice 3 with Supabase), keep the signatures and replace the bodies:
 *   - listGuides:      from("guides").select("*").eq("is_published", true)
 *   - getGuide:        same table, by id
 *   - listExperiences: from("experiences").select("*").order("created_at", { ascending: false })
 *   - saveExperience:  insert into "experiences" with campus_id and program_id taken
 *                      from the signed-in profile on the server, never from the form.
 * RLS already limits rows to the user's campus (and general guides).
 */
import { MOCK_EXPERIENCES, MOCK_GUIDES } from "./mock-data";
import type { DataResult, ExperienceRow, GuideRow } from "./types";

/** Lets us look at the error and empty screens without a database. */
export type Simulation = "error" | "empty" | null;

/** Only honoured outside production, so it can never affect real users. */
export function parseSimulation(value: unknown): Simulation {
  if (process.env.NODE_ENV === "production") return null;
  return value === "error" || value === "empty" ? value : null;
}

export async function listGuides(
  simulation: Simulation = null,
): Promise<DataResult<GuideRow[]>> {
  if (simulation === "error") {
    return { ok: false, message: "We could not load the guides right now." };
  }
  if (simulation === "empty") return { ok: true, data: [] };
  return { ok: true, data: MOCK_GUIDES.filter((g) => g.is_published) };
}

/** `data: null` with ok = true means "not found" (or not published). */
export async function getGuide(
  id: string,
  simulation: Simulation = null,
): Promise<DataResult<GuideRow | null>> {
  if (simulation === "error") {
    return { ok: false, message: "We could not load this guide right now." };
  }
  if (simulation === "empty") return { ok: true, data: null };
  const guide = MOCK_GUIDES.find((g) => g.id === id && g.is_published);
  return { ok: true, data: guide ?? null };
}

export async function listExperiences(
  simulation: Simulation = null,
): Promise<DataResult<ExperienceRow[]>> {
  if (simulation === "error") {
    return {
      ok: false,
      message: "We could not load senior experiences right now.",
    };
  }
  if (simulation === "empty") return { ok: true, data: [] };
  return { ok: true, data: MOCK_EXPERIENCES };
}
