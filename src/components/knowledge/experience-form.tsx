"use client";

import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, fieldAria } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitExperienceAction } from "@/lib/knowledge/actions";
import { PERSONAL_EXPERIENCE_LABEL } from "@/lib/knowledge/categories";
import { initialFormState } from "@/lib/validation/auth";

const TEXT_FIELDS = [
  {
    name: "situation",
    label: "Situation",
    hint: "What was the context? Keep it short and specific.",
  },
  {
    name: "challenge",
    label: "Challenge",
    hint: "What made it difficult?",
  },
  {
    name: "solution",
    label: "Solution",
    hint: "What did you do about it?",
  },
  { name: "result", label: "Result", hint: "What happened afterwards?" },
  {
    name: "adviceForJuniors",
    label: "Advice for juniors",
    hint: "What would you tell a new student?",
  },
] as const;

export function ExperienceForm() {
  const [state, formAction, pending] = useActionState(
    submitExperienceAction,
    initialFormState,
  );
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      <Alert variant="info" title={PERSONAL_EXPERIENCE_LABEL}>
        Your story is shared as a personal experience. Do not include names,
        emails, phone numbers, or student ID numbers.
      </Alert>

      {state.ok && state.message ? (
        <Alert variant="success">{state.message}</Alert>
      ) : null}
      {!state.ok && state.message ? (
        <Alert variant="error">{state.message}</Alert>
      ) : null}

      <Field htmlFor="title" label="Title" error={errors.title?.[0]}>
        <Input
          id="title"
          name="title"
          maxLength={300}
          invalid={Boolean(errors.title)}
          placeholder="e.g. How I planned my first midterms"
          {...fieldAria("title", errors.title?.[0])}
        />
      </Field>

      <Field
        htmlFor="semesterContext"
        label="Semester (optional)"
        hint="The semester this experience happened in."
        error={errors.semesterContext?.[0]}
      >
        <Input
          id="semesterContext"
          name="semesterContext"
          type="number"
          inputMode="numeric"
          min={1}
          max={14}
          invalid={Boolean(errors.semesterContext)}
          {...fieldAria(
            "semesterContext",
            errors.semesterContext?.[0],
            "The semester this experience happened in.",
          )}
        />
      </Field>

      {TEXT_FIELDS.map((field) => (
        <Field
          key={field.name}
          htmlFor={field.name}
          label={field.label}
          hint={field.hint}
          error={errors[field.name]?.[0]}
        >
          <Textarea
            id={field.name}
            name={field.name}
            maxLength={2000}
            invalid={Boolean(errors[field.name])}
            {...fieldAria(field.name, errors[field.name]?.[0], field.hint)}
          />
        </Field>
      ))}

      <Field
        htmlFor="tags"
        label="Tags (optional)"
        hint="Separate with commas, up to 5. Example: study-group, midterms"
        error={errors.tags?.[0]}
      >
        <Input
          id="tags"
          name="tags"
          invalid={Boolean(errors.tags)}
          {...fieldAria(
            "tags",
            errors.tags?.[0],
            "Separate with commas, up to 5. Example: study-group, midterms",
          )}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <Checkbox
          id="acknowledgePersonal"
          name="acknowledgePersonal"
          invalid={Boolean(errors.acknowledgePersonal)}
          label="I understand this is my personal experience, not official campus information."
        />
        {errors.acknowledgePersonal?.[0] ? (
          <p role="alert" className="text-caption text-red-700">
            {errors.acknowledgePersonal[0]}
          </p>
        ) : null}
      </div>

      <Button type="submit" loading={pending} className="w-full sm:w-fit">
        Submit experience
      </Button>
    </form>
  );
}
