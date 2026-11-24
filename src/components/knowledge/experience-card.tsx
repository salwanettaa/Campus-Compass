import { UserRound } from "lucide-react";
import { PERSONAL_EXPERIENCE_LABEL } from "@/lib/knowledge/categories";
import type { ExperienceRow } from "@/lib/knowledge/types";

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
      className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-card sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-caption inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-0.5 font-medium text-amber-900">
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
      <dl className="flex flex-col gap-2">
        {SECTIONS.map(([key, label]) => (
          <div key={key}>
            <dt className="text-h5 text-brand-950">{label}</dt>
            <dd className="text-body text-brand-900">{experience[key]}</dd>
          </div>
        ))}
      </dl>
      {experience.tags.length > 0 ? (
        <ul className="flex flex-wrap gap-2" aria-label="Tags">
          {experience.tags.map((tag) => (
            <li
              key={tag}
              className="text-caption rounded-full bg-brand-100 px-3 py-0.5 text-brand-900"
            >
              #{tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
