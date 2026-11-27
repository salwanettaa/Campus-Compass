import type { AdaptationArea, MainChallenge } from "@/lib/constants/onboarding";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { ChecklistStatus } from "@/types/database";
import { personalizeJourney } from "./roadmap-data";
import type { PersonalizedJourney } from "./types";

export type JourneyLoadResult = {
  journey: PersonalizedJourney;
  schemaReady: boolean;
  error: string | null;
};

function isMissingTableError(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "PGRST205" ||
    Boolean(error.message?.includes("does not exist")) ||
    Boolean(error.message?.includes("Could not find the table"))
  );
}

function isMissingColumnError(error: { code?: string; message?: string } | null) {
  if (!error) return false;
  return (
    error.code === "42703" ||
    error.code === "PGRST204" ||
    Boolean(error.message?.includes("column"))
  );
}

export async function getUserJourneyData(
  area: AdaptationArea,
  challenge: MainChallenge,
): Promise<JourneyLoadResult> {
  if (!hasSupabaseEnv()) {
    return {
      journey: personalizeJourney(area, challenge, {}, {}, "", {}),
      schemaReady: false,
      error: null,
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        journey: personalizeJourney(area, challenge, {}, {}, "", {}),
        schemaReady: true,
        error: null,
      };
    }

    const [progressWithNotesRes, reflectionRes, linkedTasksRes] =
      await Promise.all([
        supabase
          .from("journey_checklist_progress")
          .select("checklist_item_id, status, note")
          .eq("user_id", user.id)
          .eq("area", area),
        supabase
          .from("journey_reflections")
          .select("note")
          .eq("user_id", user.id)
          .eq("area", area)
          .maybeSingle(),
        supabase
          .from("user_tasks")
          .select("id, journey_checklist_id")
          .eq("user_id", user.id)
          .not("journey_checklist_id", "is", null),
      ]);

    let progressRows: {
      checklist_item_id: string;
      status: string;
      note?: string | null;
    }[] = [];
    let progressError = progressWithNotesRes.error;

    if (isMissingColumnError(progressWithNotesRes.error)) {
      const fallbackRes = await supabase
        .from("journey_checklist_progress")
        .select("checklist_item_id, status")
        .eq("user_id", user.id)
        .eq("area", area);
      progressRows = fallbackRes.data ?? [];
      progressError = fallbackRes.error;
    } else {
      progressRows = progressWithNotesRes.data ?? [];
    }

    if (
      isMissingTableError(progressError) ||
      isMissingTableError(reflectionRes.error) ||
      isMissingTableError(linkedTasksRes.error)
    ) {
      return {
        journey: personalizeJourney(area, challenge, {}, {}, "", {}),
        schemaReady: false,
        error: null,
      };
    }

    if (progressError || reflectionRes.error || linkedTasksRes.error) {
      return {
        journey: personalizeJourney(area, challenge, {}, {}, "", {}),
        schemaReady: true,
        error: "Could not load your journey progress right now.",
      };
    }

    const statusByItemId: Record<string, ChecklistStatus> = {};
    const noteByItemId: Record<string, string> = {};
    for (const row of progressRows) {
      statusByItemId[row.checklist_item_id] = row.status as ChecklistStatus;
      if (row.note) {
        noteByItemId[row.checklist_item_id] = row.note;
      }
    }

    const linkedTaskIdByItemId: Record<string, string> = {};
    for (const task of linkedTasksRes.data ?? []) {
      if (task.journey_checklist_id) {
        linkedTaskIdByItemId[task.journey_checklist_id] = task.id;
      }
    }

    const reflectionNote = reflectionRes.data?.note ?? "";

    return {
      journey: personalizeJourney(
        area,
        challenge,
        statusByItemId,
        linkedTaskIdByItemId,
        reflectionNote,
        noteByItemId,
      ),
      schemaReady: true,
      error: null,
    };
  } catch {
    return {
      journey: personalizeJourney(area, challenge, {}, {}, "", {}),
      schemaReady: true,
      error: "Could not load your journey progress right now.",
    };
  }
}
