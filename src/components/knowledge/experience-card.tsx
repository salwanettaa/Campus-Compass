import { CheckCircle2, Signpost, UserRound } from "lucide-react";
import { HelpfulButton } from "@/components/community/helpful-button";
import { ButtonLink } from "@/components/ui/button";
import { PERSONAL_EXPERIENCE_LABEL } from "@/lib/knowledge/categories";
import type { ExperienceRow } from "@/lib/knowledge/types";

const SECTIONS = [
  ["situation", "Situation"],
  ["challenge", "Challenge"],
  ["solution", "Solution"],
  ["result", "Result"],
  ["advice_for_juniors", "Advice for juniors"],
] as const;

/** A senior's story, read top to bottom in the order it happened. */
export function ExperienceCard({ experience }: { experience: ExperienceRow }) {
  const aiQuery = encodeURIComponent(
    `Based on the senior experience "${experience.title}", what practical steps can a first-year student apply?`,
  );

  return (
    <article
      aria-labelledby={`exp-${experience.id}`}
      className="flex flex-col gap-4 rounded-md border border-brand-300 bg-paper-raised p-5 sm:p-7"
    >
      <div className="flex flex-col gap-2">
        <h3 id={`exp-${experience.id}`} className="text-h3 text-balance text-brand-950">
          {experience.title}
        </h3>
        <div className="text-caption flex flex-wrap items-center gap-x-4 gap-y-1 text-brand-800">
          <span className="inline-flex items-center gap-1.5 font-semibold text-amber-900">
            <UserRound className="size-4" aria-hidden="true" />
            {PERSONAL_EXPERIENCE_LABEL}
          </span>
          {experience.is_verified_contributor ? (
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
              <CheckCircle2 className="size-4" aria-hidden="true" />
              Verified contributor
            </span>
          ) : null}
          {experience.semester_context ? (
            <span>Semester {experience.semester_context}</span>
          ) : null}
        </div>
      </div>

      <dl className="divide-y divide-brand-300 border-y border-brand-300">
        {SECTIONS.map(([key, label]) => (
          <div
            key={key}
            className="grid gap-x-8 gap-y-1 py-3 md:grid-cols-[9rem_minmax(0,1fr)]"
          >
            <dt className="text-h5 text-brand-950">{label}</dt>
            <dd className="text-body text-pretty max-w-2xl text-brand-900">
              {experience[key]}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap items-center justify-between gap-3">
        {experience.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-x-3" aria-label="Tags">
            {experience.tags.map((tag) => (
              <li key={tag} className="font-mono text-xs text-brand-800">
                #{tag}
              </li>
            ))}
          </ul>
        ) : (
          <span />
        )}

        <div className="flex flex-wrap items-center gap-2">
          <ButtonLink
            href={`/ai-navigator?q=${aiQuery}`}
            variant="outline"
            size="sm"
          >
            <Signpost className="size-4 text-brand-700" aria-hidden="true" />
            <span>Ask AI</span>
          </ButtonLink>
          <HelpfulButton
            initialCount={experience.helpful_count}
            target="experience"
          />
        </div>
      </div>
    </article>
  );
}
