import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { UserTaskRow } from "@/types/database";

export type TasksLoadResult = {
  tasks: UserTaskRow[];
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

export async function getUserTasks(): Promise<TasksLoadResult> {
  if (!hasSupabaseEnv()) {
    return { tasks: [], schemaReady: false, error: null };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { tasks: [], schemaReady: true, error: null };
    }

    const { data, error } = await supabase
      .from("user_tasks")
      .select(
        "id, user_id, title, description, due_date, priority, category, status, journey_checklist_id, created_at, updated_at",
      )
      .eq("user_id", user.id)
      .order("status", { ascending: false }) // 'todo' before 'completed'
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });

    if (isMissingTableError(error)) {
      return { tasks: [], schemaReady: false, error: null };
    }

    if (error) {
      return {
        tasks: [],
        schemaReady: true,
        error: "Could not load your tasks right now.",
      };
    }

    return {
      tasks: (data ?? []) as UserTaskRow[],
      schemaReady: true,
      error: null,
    };
  } catch {
    return {
      tasks: [],
      schemaReady: true,
      error: "Could not load your tasks right now.",
    };
  }
}
