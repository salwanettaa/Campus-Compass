"use client";

import { useState, useTransition } from "react";
import {
  Check,
  CheckCircle2,
  Plus,
  RotateCcw,
  SkipForward,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  saveChecklistNoteAction,
  updateChecklistStatusAction,
} from "@/lib/journey/actions";
import type { PersonalizedChecklistItem } from "@/lib/journey/types";
import { addChecklistToTasksAction } from "@/lib/tasks/actions";
import { cn } from "@/lib/utils";
import type { ChecklistStatus } from "@/types/database";

export type ChecklistItemRowProps = {
  item: PersonalizedChecklistItem;
  allowSkip?: boolean;
  /** A plain list row, for use inside a card. */
  flush?: boolean;
  onFeedback?: (ok: boolean, message: string) => void;
};

export function ChecklistItemRow({
  item,
  allowSkip = true,
  flush = false,
  onFeedback,
}: ChecklistItemRowProps) {
  const [prevItem, setPrevItem] = useState(item);
  const [status, setStatus] = useState<ChecklistStatus>(item.status);
  const [linkedTaskId, setLinkedTaskId] = useState<string | null>(
    item.linkedTaskId,
  );
  const [savedNote, setSavedNote] = useState(item.note);
  const [noteDraft, setNoteDraft] = useState(item.note);
  const [editingNote, setEditingNote] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (
    item.status !== prevItem.status ||
    item.linkedTaskId !== prevItem.linkedTaskId ||
    item.note !== prevItem.note
  ) {
    setPrevItem(item);
    setStatus(item.status);
    setLinkedTaskId(item.linkedTaskId);
    setSavedNote(item.note);
    setNoteDraft(item.note);
  }

  function handleStatusChange(nextStatus: ChecklistStatus) {
    const previous = status;
    setStatus(nextStatus);
    startTransition(async () => {
      const res = await updateChecklistStatusAction(item.id, nextStatus);
      if (!res.ok) {
        setStatus(previous);
      }
      onFeedback?.(res.ok, res.message);
    });
  }

  function handleAddToTasks() {
    if (linkedTaskId) return;
    startTransition(async () => {
      const res = await addChecklistToTasksAction(item.id);
      if (res.ok && res.task) {
        setLinkedTaskId(res.task.id);
      }
      onFeedback?.(res.ok, res.message);
    });
  }

  function handleSaveNote(event: React.FormEvent) {
    event.preventDefault();
    startTransition(async () => {
      const trimmed = noteDraft.trim();
      const res = await saveChecklistNoteAction(item.id, trimmed);
      if (res.ok) {
        setSavedNote(trimmed);
        setNoteDraft(trimmed);
        setEditingNote(false);
      }
      onFeedback?.(res.ok, res.message);
    });
  }

  const isCompleted = status === "completed";
  const isSkipped = status === "skipped";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 transition-colors",
        flush ? "py-3.5" : "rounded-xl border p-3.5",
        !flush &&
          (isCompleted
            ? "border-emerald-700/40 bg-emerald-50"
            : "border-brand-300 bg-paper"),
      )}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex min-w-0 items-start gap-3">
          <button
            type="button"
            disabled={isPending}
            aria-pressed={isCompleted}
            aria-label={
              isCompleted
                ? `Mark "${item.title}" as not completed`
                : `Mark "${item.title}" as completed`
            }
            onClick={() =>
              handleStatusChange(isCompleted ? "pending" : "completed")
            }
            className={cn(
              "hit-box mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-[0.35rem] border-2 transition-colors lg:size-5",
              isCompleted
                ? "border-emerald-700 bg-emerald-700 text-white"
                : "border-brand-400 bg-paper-raised hover:border-brand-700",
            )}
          >
            {isCompleted ? (
              <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            ) : null}
          </button>

          <div className="min-w-0 flex-1">
            <p
              className={cn(
                "text-body",
                isCompleted
                  ? "text-brand-800 line-through"
                  : isSkipped
                    ? "text-brand-800 italic"
                    : "text-brand-950",
              )}
            >
              {item.title}
            </p>
            {isSkipped ? (
              <span className="text-caption text-brand-800">Skipped</span>
            ) : null}
            {savedNote && !editingNote ? (
              <p className="mt-1.5 rounded-lg border border-brand-300/80 bg-paper-raised px-3 py-2 text-caption whitespace-pre-line text-brand-900">
                <span className="font-medium text-brand-700">Your note: </span>
                {savedNote}
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pl-9 lg:pl-8">
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              setNoteDraft(savedNote);
              setEditingNote((v) => !v);
            }}
            className={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-lg border px-3 text-caption transition-colors",
              savedNote
                ? "border-brand-600 bg-brand-100 text-brand-950"
                : "border-brand-300 text-brand-800 hover:border-brand-600 hover:text-brand-950",
            )}
          >
            <StickyNote className="size-3.5" aria-hidden="true" />
            {savedNote ? "Edit note" : "Add note"}
          </button>

          {allowSkip ? (
            isSkipped ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleStatusChange("pending")}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-brand-300 px-3 text-caption text-brand-800 transition-colors hover:border-brand-600 hover:text-brand-950"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Restore
              </button>
            ) : !isCompleted ? (
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleStatusChange("skipped")}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-brand-300 px-3 text-caption text-brand-800 transition-colors hover:border-brand-600 hover:text-brand-950"
              >
                <SkipForward className="size-3.5" aria-hidden="true" />
                Skip
              </button>
            ) : null
          ) : null}

          {linkedTaskId ? (
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-100 px-3 text-caption text-brand-900">
              <CheckCircle2
                className="size-3.5 text-brand-700"
                aria-hidden="true"
              />
              In My Tasks
            </span>
          ) : (
            <button
              type="button"
              disabled={isPending}
              onClick={handleAddToTasks}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-brand-400 bg-paper-raised px-3 text-caption text-brand-950 transition-colors hover:border-brand-700 hover:bg-brand-100"
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Add to My Tasks
            </button>
          )}
        </div>
      </div>

      {editingNote ? (
        <form
          onSubmit={handleSaveNote}
          className="flex flex-col gap-2 pl-8 sm:pl-8"
        >
          <label htmlFor={`note-${item.id}`} className="sr-only">
            Note for {item.title}
          </label>
          <Textarea
            id={`note-${item.id}`}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Write what you found or achieved (e.g. target roles, organizations, deadlines)..."
            className="min-h-20"
            maxLength={1000}
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingNote(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={isPending}>
              Save Note
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
