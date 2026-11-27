"use server";

import { revalidatePath } from "next/cache";
import { findChecklistItemMeta } from "@/lib/journey/roadmap-data";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { TaskCategory, UserTaskRow } from "@/types/database";
import { createTaskSchema, updateTaskSchema } from "./validation";

export type TaskActionResult = {
  ok: boolean;
  message: string;
  task?: UserTaskRow;
};

export async function createTaskAction(input: {
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: string | null;
  category?: string;
  journeyChecklistId?: string | null;
}): Promise<TaskActionResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const parsed = createTaskSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check your task details.",
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

    if (parsed.data.journeyChecklistId) {
      const { data: existing } = await supabase
        .from("user_tasks")
        .select("*")
        .eq("user_id", user.id)
        .eq("journey_checklist_id", parsed.data.journeyChecklistId)
        .maybeSingle();

      if (existing) {
        return {
          ok: true,
          message: "Already added to My Tasks.",
          task: existing as UserTaskRow,
        };
      }
    }

    const { data, error } = await supabase
      .from("user_tasks")
      .insert({
        user_id: user.id,
        title: parsed.data.title,
        description: parsed.data.description,
        due_date: parsed.data.dueDate,
        priority: parsed.data.priority,
        category: parsed.data.category,
        status: "todo",
        journey_checklist_id: parsed.data.journeyChecklistId,
      })
      .select("*")
      .single();

    if (error || !data) {
      return {
        ok: false,
        message: "Could not save task. Make sure the latest database patch is applied.",
      };
    }

    revalidatePath("/home");
    revalidatePath("/journey");
    return {
      ok: true,
      message: "Task added to My Tasks.",
      task: data as UserTaskRow,
    };
  } catch {
    return { ok: false, message: "Could not save task right now." };
  }
}

export async function addChecklistToTasksAction(
  checklistItemId: string,
): Promise<TaskActionResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const meta = findChecklistItemMeta(checklistItemId);
  if (!meta) {
    return { ok: false, message: "Unknown journey checklist item." };
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
      .from("user_tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("journey_checklist_id", checklistItemId)
      .maybeSingle();

    if (existing) {
      return {
        ok: true,
        message: "This item is already in My Tasks.",
        task: existing as UserTaskRow,
      };
    }

    // Match the current checklist item status if already completed.
    const { data: progress } = await supabase
      .from("journey_checklist_progress")
      .select("status")
      .eq("user_id", user.id)
      .eq("checklist_item_id", checklistItemId)
      .maybeSingle();

    const initialStatus = progress?.status === "completed" ? "completed" : "todo";

    const { data, error } = await supabase
      .from("user_tasks")
      .insert({
        user_id: user.id,
        title: meta.item.title,
        description: `From My Journey (${meta.stage.title})`,
        category: meta.area as TaskCategory,
        status: initialStatus,
        journey_checklist_id: checklistItemId,
      })
      .select("*")
      .single();

    if (error || !data) {
      return {
        ok: false,
        message: "Could not add item to My Tasks.",
      };
    }

    revalidatePath("/home");
    revalidatePath("/journey");
    return {
      ok: true,
      message: "Added to My Tasks.",
      task: data as UserTaskRow,
    };
  } catch {
    return { ok: false, message: "Could not add item to My Tasks." };
  }
}

export async function toggleTaskStatusAction(
  taskId: string,
  completed: boolean,
): Promise<TaskActionResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, message: "Please sign in again." };
    }

    const nextStatus = completed ? "completed" : "todo";
    const { data, error } = await supabase
      .from("user_tasks")
      .update({ status: nextStatus })
      .eq("id", taskId)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error || !data) {
      return { ok: false, message: "Could not update task status." };
    }

    const task = data as UserTaskRow;

    // Bidirectional sync: update linked My Journey checklist item if present.
    if (task.journey_checklist_id) {
      const meta = findChecklistItemMeta(task.journey_checklist_id);
      if (meta) {
        await supabase.from("journey_checklist_progress").upsert(
          {
            user_id: user.id,
            area: meta.area,
            checklist_item_id: task.journey_checklist_id,
            status: completed ? "completed" : "pending",
          },
          { onConflict: "user_id,checklist_item_id" },
        );
      }
    }

    revalidatePath("/home");
    revalidatePath("/journey");
    return {
      ok: true,
      message: completed ? "Task completed." : "Task marked as active.",
      task,
    };
  } catch {
    return { ok: false, message: "Could not update task status." };
  }
}

export async function updateTaskAction(input: {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  priority?: string | null;
  category?: string;
}): Promise<TaskActionResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const parsed = updateTaskSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Check your task details.",
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

    const { data, error } = await supabase
      .from("user_tasks")
      .update({
        title: parsed.data.title,
        description: parsed.data.description,
        due_date: parsed.data.dueDate,
        priority: parsed.data.priority,
        category: parsed.data.category,
      })
      .eq("id", parsed.data.id)
      .eq("user_id", user.id)
      .select("*")
      .single();

    if (error || !data) {
      return { ok: false, message: "Could not update task." };
    }

    revalidatePath("/home");
    revalidatePath("/journey");
    return {
      ok: true,
      message: "Task updated.",
      task: data as UserTaskRow,
    };
  } catch {
    return { ok: false, message: "Could not update task." };
  }
}

export async function deleteTaskAction(
  taskId: string,
): Promise<TaskActionResult> {
  if (!hasSupabaseEnv()) {
    return { ok: false, message: "Supabase is not configured." };
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
      .from("user_tasks")
      .delete()
      .eq("id", taskId)
      .eq("user_id", user.id);

    if (error) {
      return { ok: false, message: "Could not delete task." };
    }

    revalidatePath("/home");
    revalidatePath("/journey");
    return { ok: true, message: "Task deleted." };
  } catch {
    return { ok: false, message: "Could not delete task." };
  }
}
