import { UserRound } from "lucide-react";
import { PERSONAL_EXPERIENCE_LABEL } from "@/lib/knowledge/categories";
import type { ExperienceRow } from "@/lib/knowledge/types";
import { cn } from "@/lib/utils";

const SECTIONS = [
  ["situation", "Situation"],
  ["challenge", "Challenge"],
  ["solution", "Solution"],
  ["result", "Result"],
  ["advice_for_juniors", "Advice for juniors"],
] as const;

export function ExperienceCard({ experience }: { experience: ExperienceRow }) {
  return (
    <article
      aria-labelledby={`exp-${experience.id}`}
      className="flex flex-col gap-4 rounded-xl border border-brand-950/10 bg-paper-raised p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] inline-flex items-center gap-1 rounded-md border border-amber-900/15 bg-amber-50 px-2.5 py-1 font-medium uppercase tracking-wide text-amber-900">
          <UserRound className="size-4" aria-hidden="true" />
          {PERSONAL_EXPERIENCE_LABEL}
        </span>
        {experience.is_verified_contributor ? (
          <span className="text-caption font-medium text-emerald-800">
            Verified contributor
          </span>
        ) : null}
        {experience.semester_context ? (
          <span className="text-caption text-brand-800">
            Semester {experience.semester_context}
          </span>
        ) : null}
      </div>
      <h3 id={`exp-${experience.id}`} className="text-h3 text-brand-950">
        {experience.title}
      </h3>
      <dl className="grid gap-x-6 sm:grid-cols-2">
        {SECTIONS.map(([key, label]) => (
          <div
            key={key}
            className={cn(
              "border-t border-brand-950/10 py-3",
              key === "advice_for_juniors" && "sm:col-span-2",
            )}
          >
            <dt className="font-mono text-[10px] uppercase tracking-wide text-brand-700">
              {label}
            </dt>
            <dd className="text-body mt-1 text-brand-900">{experience[key]}</dd>
          </div>
        ))}
      </dl>
      {experience.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Tags">
          {experience.tags.map((tag) => (
            <li
              key={tag}
              className="font-mono text-[10px] rounded-md border border-brand-950/10 bg-paper px-2.5 py-1 text-brand-800"
            >
              #{tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
