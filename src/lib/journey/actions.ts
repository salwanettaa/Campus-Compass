"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ADAPTATION_AREA_VALUES } from "@/lib/constants/onboarding";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { ChecklistStatus } from "@/types/database";
import { findChecklistItemMeta } from "./roadmap-data";

export type ActionResult = {
  ok: boolean;
  message: string;
};

const checklistUpdateSchema = z.object({
  checklistItemId: z.string().min(1).max(120),
  status: z.enum(["pending", "completed", "skipped"]),
});

export async function updateChecklistStatusAction(
  checklistItemId: string,
  status: ChecklistStatus,
): Promise<ActionResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const parsed = checklistUpdateSchema.safeParse({ checklistItemId, status });
  if (!parsed.success) {
    return { ok: false, message: "Invalid checklist item." };
  }

  const meta = findChecklistItemMeta(parsed.data.checklistItemId);
  if (!meta) {
    return { ok: false, message: "Unknown checklist item." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, message: "Please sign in again." };
    }

    const { error } = await supabase
      .from("journey_checklist_progress")
      .upsert(
        {
          user_id: user.id,
          area: meta.area,
          checklist_item_id: parsed.data.checklistItemId,
          status: parsed.data.status,
        },
        { onConflict: "user_id,checklist_item_id" },
      );

    if (error) {
      return {
        ok: false,
        message: "Could not save checklist progress. Make sure the latest database patch is applied.",
      };
    }

    // Bidirectional sync: update any linked task in My Tasks.
    if (parsed.data.status === "completed") {
      await supabase
        .from("user_tasks")
        .update({ status: "completed" })
        .eq("user_id", user.id)
        .eq("journey_checklist_id", parsed.data.checklistItemId);
    } else if (parsed.data.status === "pending") {
      await supabase
        .from("user_tasks")
        .update({ status: "todo" })
        .eq("user_id", user.id)
        .eq("journey_checklist_id", parsed.data.checklistItemId);
    }

    revalidatePath("/home");
    revalidatePath("/journey");

    const label =
      parsed.data.status === "completed"
        ? "Checklist item completed."
        : parsed.data.status === "skipped"
          ? "Checklist item skipped."
          : "Checklist item reopened.";

    return { ok: true, message: label };
  } catch {
    return { ok: false, message: "Could not update checklist progress." };
  }
}

const reflectionSchema = z.object({
  area: z.enum(ADAPTATION_AREA_VALUES),
  note: z.string().trim().max(2000, "Reflection must be under 2,000 characters."),
});

export async function saveJourneyReflectionAction(
  area: string,
  note: string,
): Promise<ActionResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const parsed = reflectionSchema.safeParse({ area, note });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid reflection.",
    };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, message: "Please sign in again." };
    }

    const { error } = await supabase
      .from("journey_reflections")
      .upsert(
        {
          user_id: user.id,
          area: parsed.data.area,
          note: parsed.data.note,
        },
        { onConflict: "user_id,area" },
      );

    if (error) {
      return {
        ok: false,
        message: "Could not save your reflection right now.",
      };
    }

    revalidatePath("/home");
    revalidatePath("/journey");
    return { ok: true, message: "Reflection saved." };
  } catch {
    return { ok: false, message: "Could not save your reflection right now." };
  }
}

const checklistNoteSchema = z.object({
  checklistItemId: z.string().min(1).max(120),
  note: z.string().trim().max(1000, "Note must be 1,000 characters or less."),
});

export async function saveChecklistNoteAction(
  checklistItemId: string,
  note: string,
): Promise<ActionResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const parsed = checklistNoteSchema.safeParse({ checklistItemId, note });
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Invalid note.",
    };
  }

  const meta = findChecklistItemMeta(parsed.data.checklistItemId);
  if (!meta) {
    return { ok: false, message: "Unknown checklist item." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, message: "Please sign in again." };
    }

    const { data: existing } = await supabase
      .from("journey_checklist_progress")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("checklist_item_id", parsed.data.checklistItemId)
      .maybeSingle();

    const { error } = existing
      ? await supabase
          .from("journey_checklist_progress")
          .update({ note: parsed.data.note || null })
          .eq("id", existing.id)
      : await supabase.from("journey_checklist_progress").insert({
          user_id: user.id,
          area: meta.area,
          checklist_item_id: parsed.data.checklistItemId,
          status: "pending",
          note: parsed.data.note || null,
        });

    if (error) {
      return {
        ok: false,
        message:
          "Could not save note. Apply supabase/patches/05_checklist_notes.sql in Supabase first.",
      };
    }

    revalidatePath("/home");
    revalidatePath("/journey");
    return {
      ok: true,
      message: parsed.data.note ? "Step note saved." : "Step note cleared.",
    };
  } catch {
    return { ok: false, message: "Could not save note right now." };
  }
}
