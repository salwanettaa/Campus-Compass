"use client";

import { useId, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categoryName } from "@/lib/knowledge/categories";
import { GUIDE_CATEGORIES } from "@/lib/knowledge/types";

/**
 * Native <dialog> modal for requesting a missing campus guide.
 * Uses a quiet text-link trigger so it does not compete with the page primary CTA.
 */
export function RequestGuideModal() {
  const uid = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState<string>(GUIDE_CATEGORIES[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  function openDialog() {
    setSubmitted(false);
    setError(null);
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) {
      setError("Enter the guide topic you are looking for.");
      return;
    }
    setError(null);
    setSubmitted(true);
    setTopic("");
    setNote("");
  }

  const titleId = `${uid}-title`;
  const topicId = `${uid}-topic`;
  const catId = `${uid}-cat`;
  const noteId = `${uid}-note`;

  return (
    <>
      <button
        type="button"
        onClick={openDialog}
        className="inline-flex min-h-11 items-center gap-1.5 text-h5 text-brand-700 underline underline-offset-4 hover:text-brand-950"
      >
        <span>Request a guide</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto w-[min(32rem,calc(100%-2rem))] overscroll-contain rounded-md border border-brand-300 bg-paper-raised p-6 text-brand-950 shadow-overlay backdrop:bg-ink/40"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 id={titleId} className="text-h2 text-brand-950">
              Request a campus guide
            </h2>
            <p className="text-body text-pretty text-brand-800">
              Missing a rule or procedure? Tell us what you need verified.
            </p>
          </div>
          <button
            type="button"
            onClick={closeDialog}
            aria-label="Close dialog"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-brand-800 hover:bg-brand-100 hover:text-brand-950"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {submitted ? (
          <div className="mt-5 flex flex-col gap-4">
            <Alert variant="success" title="Request sent">
              Campus curators received your suggestion and will verify the official source.
            </Alert>
            <Button type="button" onClick={closeDialog} className="self-end">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
            <Field htmlFor={topicId} label="Guide topic" error={error ?? undefined}>
              <Input
                id={topicId}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                invalid={Boolean(error)}
                placeholder="e.g. UKT dispensation procedure at Sekolah Vokasi"
                maxLength={150}
              />
            </Field>

            <Field htmlFor={catId} label="Category">
              <Select
                id={catId}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {GUIDE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryName(cat)}
                  </option>
                ))}
              </Select>
            </Field>

            <Field
              htmlFor={noteId}
              label="Additional context (optional)"
              hint="Mention the office, portal, or issue you ran into."
            >
              <Textarea
                id={noteId}
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={500}
              />
            </Field>

            <div className="mt-2 flex flex-wrap justify-end gap-2">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button type="submit">Send request</Button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
