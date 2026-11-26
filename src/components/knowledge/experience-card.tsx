import Link from "next/link";
import { Bot, CheckCircle2, UserRound } from "lucide-react";
import { ExperienceHelpfulBtn } from "@/components/knowledge/experience-helpful-btn";
import { PERSONAL_EXPERIENCE_LABEL } from "@/lib/knowledge/categories";
import type { ExperienceRow } from "@/lib/knowledge/types";

const SECTIONS = [
  { key: "situation", label: "Situation", badge: "S", badgeColor: "bg-blue-100 text-blue-900 border-blue-200" },
  { key: "challenge", label: "Challenge", badge: "T", badgeColor: "bg-amber-100 text-amber-900 border-amber-200" },
  { key: "solution", label: "Solution", badge: "A", badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200" },
  { key: "result", label: "Result", badge: "R", badgeColor: "bg-purple-100 text-purple-900 border-purple-200" },
  { key: "advice_for_juniors", label: "Advice for juniors", badge: "💡", badgeColor: "bg-brand-100 text-brand-950 border-brand-200" },
] as const;

/** A senior's story, structured in the Glassdoor STAR format. */
export function ExperienceCard({ experience }: { experience: ExperienceRow }) {
  const aiQuery = encodeURIComponent(
    `Bantu elaborasi pengalaman senior ini: "${experience.title}". Bagaimana tips praktis yang bisa saya ambil sebagai junior?`,
  );

  return (
    <article
      aria-labelledby={`exp-${experience.id}`}
      className="flex flex-col gap-4 rounded-2xl border border-brand-300 bg-paper-raised p-5 sm:p-7 shadow-xs hover:border-brand-500 transition-all duration-150"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-caption flex flex-wrap items-center gap-x-3 gap-y-1 text-brand-800">
            <span className="inline-flex items-center gap-1.5 font-semibold text-amber-900">
              <UserRound className="size-4" aria-hidden="true" />
              {PERSONAL_EXPERIENCE_LABEL}
            </span>
            {experience.is_verified_contributor ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                Verified contributor
              </span>
            ) : null}
            {experience.semester_context ? (
              <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-card-tint border border-brand-200">
                Semester {experience.semester_context}
              </span>
            ) : null}
          </div>
        </div>

        <h3 id={`exp-${experience.id}`} className="text-h3 text-balance font-semibold text-brand-950 leading-snug">
          {experience.title}
        </h3>
      </div>

      <dl className="divide-y divide-brand-200 border-y border-brand-300">
        {SECTIONS.map(({ key, label, badge, badgeColor }) => (
          <div
            key={key}
            className="grid gap-x-6 gap-y-1 py-3.5 md:grid-cols-[11rem_minmax(0,1fr)] items-start"
          >
            <dt className="text-h5 text-brand-950 flex items-center gap-2">
              <span
                className={`inline-flex size-5 shrink-0 items-center justify-center rounded-md border text-xs font-bold font-mono ${badgeColor}`}
                aria-hidden="true"
              >
                {badge}
              </span>
              <span>{label}</span>
            </dt>
            <dd className="text-body text-pretty max-w-2xl text-brand-900 leading-relaxed">
              {experience[key]}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {experience.tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Tags">
            {experience.tags.map((tag) => (
              <li
                key={tag}
                className="font-mono text-xs rounded-md bg-card-tint border border-brand-200 px-2 py-1 text-brand-800"
              >
                #{tag}
              </li>
            ))}
          </ul>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Link
            href={`/ai-navigator?q=${aiQuery}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-brand-300 bg-white px-2.5 text-caption font-medium text-brand-800 hover:border-brand-600 hover:text-brand-950 transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
          >
            <Bot className="size-3.5 text-brand-700" aria-hidden="true" />
            <span>Tanya AI tentang ini</span>
          </Link>
          <ExperienceHelpfulBtn
            experienceId={experience.id}
            initialCount={experience.helpful_count}
          />
        </div>
      </div>
    </article>
  );
}
