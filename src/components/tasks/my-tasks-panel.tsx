"use client";

import { useMemo, useState, useTransition } from "react";
import {
  Calendar,
  Check,
  Compass,
  Flag,
  ListTodo,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { AdaptationArea } from "@/lib/constants/onboarding";
import {
  createTaskAction,
  deleteTaskAction,
  toggleTaskStatusAction,
  updateTaskAction,
} from "@/lib/tasks/actions";
import { TASK_CATEGORIES, TASK_PRIORITIES } from "@/lib/tasks/validation";
import { cn } from "@/lib/utils";
import type { TaskCategory, TaskPriority, UserTaskRow } from "@/types/database";

type FilterTab = "all" | "upcoming" | "completed";

export type MyTasksPanelProps = {
  initialTasks: UserTaskRow[];
  defaultCategory: AdaptationArea;
  schemaReady: boolean;
  loadError: string | null;
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: "border-red-600/50 bg-red-50 text-red-950",
  medium: "border-amber-800/50 bg-paper text-amber-900",
  low: "border-brand-300 bg-paper text-brand-800",
};

function categoryLabel(category: string) {
  return (
    TASK_CATEGORIES.find((c) => c.value === category)?.label ?? "Personal"
  );
}

export function MyTasksPanel({
  initialTasks,
  defaultCategory,
  schemaReady,
  loadError,
}: MyTasksPanelProps) {
  const [prevInitialTasks, setPrevInitialTasks] = useState(initialTasks);
  const [tasks, setTasks] = useState<UserTaskRow[]>(initialTasks);
  if (initialTasks !== prevInitialTasks) {
    setPrevInitialTasks(initialTasks);
    setTasks(initialTasks);
  }
  const [filter, setFilter] = useState<FilterTab>("all");
  const [showAllTasks, setShowAllTasks] = useState(false);

  // Quick Add state
  const [quickTitle, setQuickTitle] = useState("");

  // Full Add Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<string>("");
  const [category, setCategory] = useState<TaskCategory>(defaultCategory);

  // Inline Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [editPriority, setEditPriority] = useState<string>("");
  const [editCategory, setEditCategory] = useState<TaskCategory>("personal");

  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === "completed").length,
    [tasks],
  );
  const activeCount = tasks.length - completedCount;

  const filteredTasks = useMemo(() => {
    if (filter === "upcoming") {
      return tasks.filter((t) => t.status === "todo");
    }
    if (filter === "completed") {
      return tasks.filter((t) => t.status === "completed");
    }
    // "all": show active tasks first, then completed tasks
    return [...tasks].sort((a, b) => {
      if (a.status !== b.status) return a.status === "todo" ? -1 : 1;
      return 0;
    });
  }, [tasks, filter]);

  const visibleTasks = showAllTasks
    ? filteredTasks
    : filteredTasks.slice(0, 6);

  function handleQuickAdd(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = quickTitle.trim();
    if (!trimmed) {
      setFeedback({ ok: false, message: "Enter a task title first." });
      return;
    }

    startTransition(async () => {
      const res = await createTaskAction({
        title: trimmed,
        category: defaultCategory,
      });
      if (res.ok && res.task) {
        setTasks((prev) => [res.task!, ...prev]);
        setQuickTitle("");
      }
      setFeedback({ ok: res.ok, message: res.message });
    });
  }

  function handleFullAdd(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim()) {
      setFeedback({ ok: false, message: "Task title is required." });
      return;
    }

    startTransition(async () => {
      const res = await createTaskAction({
        title: title.trim(),
        description,
        dueDate,
        priority,
        category,
      });
      if (res.ok && res.task) {
        setTasks((prev) => [res.task!, ...prev]);
        setTitle("");
        setDescription("");
        setDueDate("");
        setPriority("");
        setCategory(defaultCategory);
        setShowAddForm(false);
      }
      setFeedback({ ok: res.ok, message: res.message });
    });
  }

  function handleToggle(task: UserTaskRow) {
    const nextCompleted = task.status !== "completed";
    const previous = tasks;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, status: nextCompleted ? "completed" : "todo" }
          : t,
      ),
    );

    startTransition(async () => {
      const res = await toggleTaskStatusAction(task.id, nextCompleted);
      if (!res.ok) {
        setTasks(previous);
      } else if (res.task) {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? res.task! : t)),
        );
      }
      setFeedback({ ok: res.ok, message: res.message });
    });
  }

  function startEdit(task: UserTaskRow) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setEditDueDate(task.due_date ?? "");
    setEditPriority(task.priority ?? "");
    setEditCategory(task.category);
  }

  function handleSaveEdit(event: React.FormEvent, taskId: string) {
    event.preventDefault();
    if (!editTitle.trim()) {
      setFeedback({ ok: false, message: "Task title cannot be empty." });
      return;
    }

    startTransition(async () => {
      const res = await updateTaskAction({
        id: taskId,
        title: editTitle.trim(),
        description: editDescription,
        dueDate: editDueDate,
        priority: editPriority,
        category: editCategory,
      });
      if (res.ok && res.task) {
        setTasks((prev) =>
          prev.map((t) => (t.id === taskId ? res.task! : t)),
        );
        setEditingId(null);
      }
      setFeedback({ ok: res.ok, message: res.message });
    });
  }

  function handleDelete(taskId: string) {
    const previous = tasks;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    startTransition(async () => {
      const res = await deleteTaskAction(taskId);
      if (!res.ok) {
        setTasks(previous);
      }
      setFeedback({ ok: res.ok, message: res.message });
    });
  }

  return (
    <section
      id="my-tasks"
      aria-labelledby="tasks-heading"
      className="flex scroll-mt-6 flex-col gap-5 rounded-2xl border border-brand-300 bg-paper-raised p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-caption font-medium text-brand-700">
              <ListTodo className="size-3.5" aria-hidden="true" />
              Personal Workspace
            </span>
            <span className="text-caption text-brand-800">
              {completedCount}/{tasks.length} completed
            </span>
          </div>
          <h2 id="tasks-heading" className="text-h2 text-brand-950">
            My Tasks
          </h2>
          <p className="text-body text-brand-800">
            Track your own action items alongside steps from My Journey.
          </p>
        </div>

        <Button
          size="sm"
          variant={showAddForm ? "outline" : "primary"}
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? (
            <>
              <X className="size-4" aria-hidden="true" />
              Close
            </>
          ) : (
            <>
              <Plus className="size-4" aria-hidden="true" />
              Add Task
            </>
          )}
        </Button>
      </div>

      {loadError ? <Alert variant="error">{loadError}</Alert> : null}

      {!schemaReady ? (
        <Alert variant="info" title="Tasks table not initialized yet">
          Apply <code>supabase/patches/04_journey_and_tasks.sql</code> in
          Supabase to create and persist tasks.
        </Alert>
      ) : null}

      {feedback ? (
        <Alert variant={feedback.ok ? "success" : "error"}>
          {feedback.message}
        </Alert>
      ) : null}

      {/* Quick Add */}
      <form onSubmit={handleQuickAdd} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="quick-add-task" className="sr-only">
          Quick add a task
        </label>
        <Input
          id="quick-add-task"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          placeholder="Quick add a task (e.g. Prepare scholarship essay)..."
          disabled={isPending || !schemaReady}
        />
        <Button
          type="submit"
          variant="outline"
          loading={isPending}
          disabled={!schemaReady}
          className="h-12 shrink-0"
        >
          <Plus className="size-4" aria-hidden="true" />
          Quick Add
        </Button>
      </form>

      {/* Detailed Add Task Form */}
      {showAddForm ? (
        <form
          onSubmit={handleFullAdd}
          className="flex flex-col gap-4 rounded-xl border border-brand-300 bg-paper p-4"
        >
          <h3 className="text-h4 text-brand-950">New Task</h3>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-task-title" className="text-h5 text-brand-950">
              Task title <span className="text-route-on-dark">*</span>
            </label>
            <Input
              id="new-task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Update my CV"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="new-task-desc" className="text-h5 text-brand-950">
              Description or notes (optional)
            </label>
            <Textarea
              id="new-task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any extra context or links..."
              className="min-h-20"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="new-task-due" className="text-h5 text-brand-950">
                Due date (optional)
              </label>
              <Input
                id="new-task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="new-task-priority"
                className="text-h5 text-brand-950"
              >
                Priority (optional)
              </label>
              <Select
                id="new-task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">None</option>
                {TASK_PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="new-task-category"
                className="text-h5 text-brand-950"
              >
                Category
              </label>
              <Select
                id="new-task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
              >
                {TASK_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={isPending}>
              Save Task
            </Button>
          </div>
        </form>
      ) : null}

      {/* Filter Tabs */}
      <div
        role="tablist"
        aria-label="Filter tasks"
        className="flex flex-wrap items-center gap-2"
      >
        {(
          [
            { key: "all", label: `All (${tasks.length})` },
            { key: "upcoming", label: `Upcoming (${activeCount})` },
            { key: "completed", label: `Completed (${completedCount})` },
          ] as const
        ).map((tab) => {
          const selected = filter === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              type="button"
              aria-selected={selected}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "inline-flex min-h-9 items-center rounded-full border px-4 text-caption transition-colors",
                selected
                  ? "border-brand-700 bg-fill font-semibold text-white"
                  : "border-brand-300 bg-paper text-brand-800 hover:border-brand-600 hover:text-brand-950",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Task List */}
      {visibleTasks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-300 bg-paper p-6 text-center">
          <p className="text-body text-brand-800">
            {tasks.length === 0
              ? "No tasks yet. Add something you want to work on."
              : filter === "completed"
                ? "No completed tasks yet."
                : "No upcoming tasks. You're all caught up!"}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {visibleTasks.map((task) => {
            const isCompleted = task.status === "completed";
            const isEditing = editingId === task.id;

            if (isEditing) {
              return (
                <li
                  key={task.id}
                  className="rounded-xl border border-brand-600 bg-paper p-4"
                >
                  <form
                    onSubmit={(e) => handleSaveEdit(e, task.id)}
                    className="flex flex-col gap-3"
                  >
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Task title"
                      required
                    />
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description or notes (optional)"
                      className="min-h-16"
                    />
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                      />
                      <Select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                      >
                        <option value="">No priority</option>
                        {TASK_PRIORITIES.map((p) => (
                          <option key={p.value} value={p.value}>
                            {p.label}
                          </option>
                        ))}
                      </Select>
                      <Select
                        value={editCategory}
                        onChange={(e) =>
                          setEditCategory(e.target.value as TaskCategory)
                        }
                      >
                        {TASK_CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" size="sm" loading={isPending}>
                        Save
                      </Button>
                    </div>
                  </form>
                </li>
              );
            }

            return (
              <li
                key={task.id}
                className={cn(
                  "flex flex-col gap-2.5 rounded-xl border p-3.5 transition-colors sm:flex-row sm:items-start sm:justify-between",
                  isCompleted
                    ? "border-brand-300/60 bg-paper/60 opacity-80"
                    : "border-brand-300 bg-paper",
                )}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <button
                    type="button"
                    disabled={isPending}
                    aria-pressed={isCompleted}
                    aria-label={
                      isCompleted
                        ? `Mark "${task.title}" as incomplete`
                        : `Mark "${task.title}" as completed`
                    }
                    onClick={() => handleToggle(task)}
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[0.3rem] border-2 transition-colors",
                      isCompleted
                        ? "border-emerald-700 bg-emerald-700 text-white"
                        : "border-brand-400 bg-paper-raised hover:border-brand-700",
                    )}
                  >
                    {isCompleted ? (
                      <Check
                        className="size-3.5"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>

                  <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                    <p
                      className={cn(
                        "text-body font-medium break-words",
                        isCompleted
                          ? "text-brand-800 line-through"
                          : "text-brand-950",
                      )}
                    >
                      {task.title}
                    </p>
                    {task.description ? (
                      <p className="text-caption text-brand-800">
                        {task.description}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-brand-300 bg-paper-raised px-2.5 py-0.5 text-caption text-brand-800">
                        {categoryLabel(task.category)}
                      </span>
                      {task.priority ? (
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption",
                            PRIORITY_STYLES[task.priority],
                          )}
                        >
                          <Flag className="size-3" aria-hidden="true" />
                          {task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)}
                        </span>
                      ) : null}
                      {task.due_date ? (
                        <span className="inline-flex items-center gap-1 text-caption text-brand-800">
                          <Calendar className="size-3" aria-hidden="true" />
                          {task.due_date}
                        </span>
                      ) : null}
                      {task.journey_checklist_id ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-caption text-brand-700">
                          <Compass className="size-3" aria-hidden="true" />
                          From My Journey
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1 pl-8 sm:pl-0">
                  <button
                    type="button"
                    aria-label={`Edit "${task.title}"`}
                    onClick={() => startEdit(task)}
                    className="flex size-9 items-center justify-center rounded-md text-brand-800 transition-colors hover:bg-brand-100 hover:text-brand-950"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete "${task.title}"`}
                    onClick={() => handleDelete(task.id)}
                    className="flex size-9 items-center justify-center rounded-md text-brand-800 transition-colors hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {filteredTasks.length > 6 ? (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllTasks((v) => !v)}
          >
            {showAllTasks
              ? "Show fewer tasks"
              : `View all ${filteredTasks.length} tasks`}
          </Button>
        </div>
      ) : null}
    </section>
  );
}
