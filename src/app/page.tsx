import {
  CompassFinder,
  type CompassPoint,
} from "@/components/landing/compass-finder";
import Image from "next/image";
import {
  ExamplePreview,
  type PreviewItem,
} from "@/components/landing/example-preview";
import { LandingHeader } from "@/components/landing/landing-header";
import { ButtonLink } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";
import { MOCK_COMMENTS, MOCK_POSTS } from "@/lib/community/mock-data";
import {
  CATEGORY_INFO,
  sourceLabel,
} from "@/lib/knowledge/categories";
import { formatVerifiedDate } from "@/lib/knowledge/filter";
import { MOCK_GUIDES } from "@/lib/knowledge/mock-data";
import { GUIDE_CATEGORIES } from "@/lib/knowledge/types";

const STEPS = [
  {
    title: "Create your account",
    description: "Use your email and a nickname. No student ID needed.",
  },
  {
    title: "Set your starting point",
    description: "Pick your campus, semester, and what you need help with.",
  },
  {
    title: "Find your way",
    description: "Browse student questions and campus guides.",
  },
  {
    title: "Mark the route",
    description: "Share what worked so the next student can follow it.",
  },
] as const;

/** Honest status of each module. Update this when a module goes live. */
const STATUS = [
  ["Community", "Showing sample posts"],
  ["Knowledge Hub", "Showing sample guides"],
  ["AI Navigator", "Sample answers, no live AI yet"],
  ["My Journey", "Roadmap with a checklist"],
] as const;

function previewItems(): PreviewItem[] {
  const post = MOCK_POSTS[0];
  const answer = MOCK_COMMENTS.find(
    (comment) => comment.post_id === post.id && comment.is_accepted_answer,
  );
  const guide = MOCK_GUIDES[3];

  return [
    {
      label: "Question",
      title: post.title,
      body: post.content,
      replyLabel: "Accepted answer",
      reply: answer?.content ?? "No accepted answer yet.",
      note: "Replies come from students, so check rules with your campus.",
    },
    {
      label: "Guide",
      title: guide.title,
      body: guide.content_raw.split("\n\n")[0],
      replyLabel: "Source",
      reply: guide.source_reference ?? "No source listed.",
      note: "Each guide shows where it came from and when it was last checked.",
    },
  ];
}

const DIAL_NAMES = {
  academic_survival: "Academics",
  social_community: "Social",
  administrative_guide: "Admin",
  campus_essentials: "Campus",
  scholarship_growth: "Funding",
  career_preparation: "Career",
} as const;

/** One published sample guide per category, for the hero compass. */
function compassPoints(): CompassPoint[] {
  return GUIDE_CATEGORIES.flatMap((category) => {
    const guide = MOCK_GUIDES.find(
      (entry) => entry.category === category && entry.is_published,
    );
    if (!guide) return [];
    return [
      {
        id: category,
        short: DIAL_NAMES[category],
        category: CATEGORY_INFO[category].label,
        description: CATEGORY_INFO[category].description,
        guideTitle: guide.title,
        guideLine: guide.content_raw.split("\n")[0],
      },
    ];
  });
}

const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-8";

export default function LandingPage() {
  const specimen = MOCK_GUIDES[0];
  const checks = [
    {
      question: "Who is it from?",
      answer: sourceLabel(specimen.source_type),
      detail: "Official campus sources and curated guides are labelled differently.",
    },
    {
      question: "Where did it come from?",
      answer: specimen.source_reference ?? "No source listed",
      detail: "The reference stays next to the advice, so you can look it up.",
    },
    {
      question: "How old is it?",
      answer: `Last verified ${formatVerifiedDate(specimen.last_verified_at)}`,
      detail: "Older guides are flagged as possibly outdated.",
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-x-clip">
      <LandingHeader />

      <main className="flex-1">
        <section aria-labelledby="landing-title" className="border-b border-brand-300 bg-paper-raised py-12 sm:py-16 lg:py-20">
          <div className={`${CONTAINER} grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10`}>
            <div className="text-center lg:text-left">
              <h1 id="landing-title" className="text-hero text-brand-950">
                Nobody hands you a map.{" "}
                <span className="block text-brand-700">
                  Students draw one together.
                </span>
              </h1>
              <p className="text-lead mx-auto mt-7 max-w-lg text-brand-800 lg:mx-0">
                Ask questions, read guides that show their sources, and learn
                from other students.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <ButtonLink href="/register" size="lg">
                  Create your account
                </ButtonLink>
                <ButtonLink href="#steps" variant="outline" size="lg">
                  See the route
                </ButtonLink>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-700 p-3 sm:p-6">
              <Image
                src="/art/compass-flow.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 560px, 100vw"
                loading="eager"
                fetchPriority="high"
                className="art-settle object-cover"
              />
              <div className="relative">
                <CompassFinder points={compassPoints()} />
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="check-title" className="py-16 sm:py-24">
          <div className={CONTAINER}>
            <h2 id="check-title" className="text-h-section mx-auto max-w-3xl text-center">
              Advice you can{" "}
              <span className="text-brand-700">check</span>
            </h2>
            <p className="text-lead mx-auto mt-4 max-w-xl text-center text-brand-800">
              Know who said it, where it came from, and how old it is.
            </p>
            <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <article className="rounded-2xl bg-brand-100 p-3 sm:p-5">
                <div className="rounded-xl border border-brand-300 bg-paper-raised p-6 text-brand-950 sm:p-8">
                  <p className="text-caption font-semibold">
                    {CATEGORY_INFO[specimen.category].label} · sample guide
                  </p>
                  <h3 className="text-h2 mt-3">{specimen.title}</h3>
                  {specimen.content_raw.split("\n\n").map((paragraph) => (
                    <p key={paragraph} className="text-body mt-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </article>
              <dl className="relative flex flex-col gap-10">
                <span
                  aria-hidden="true"
                  className="absolute top-3 bottom-3 left-[0.4375rem] border-l-2 border-dashed border-route"
                />
                {checks.map((check) => (
                  <div key={check.question} className="relative pl-10">
                    <span
                      aria-hidden="true"
                      className="absolute top-1 left-0 size-4 rounded-full border-4 border-route bg-paper"
                    />
                    <dt className="text-body text-brand-800">{check.question}</dt>
                    <dd className="text-h2 mt-1 text-brand-950">{check.answer}</dd>
                    <dd className="text-body mt-2 max-w-md text-brand-800">{check.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section aria-labelledby="preview-title" className="border-y border-brand-300 bg-frost py-16 sm:py-24">
          <div className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14`}>
            <div>
              <h2 id="preview-title" className="text-h-section">
                Learn from{" "}
                <span className="text-brand-700">students</span>
              </h2>
              <p className="text-lead mt-4 text-brand-900">
                Switch between a question and a guide. Questions can have an
                accepted answer and helpful votes.
              </p>
            </div>
            <ExamplePreview items={previewItems()} />
          </div>
        </section>

        <section id="steps" aria-labelledby="steps-title" className="scroll-mt-20 py-16 sm:py-24">
          <div className={CONTAINER}>
            <h2 id="steps-title" className="text-h-section">
              Your route in four steps
            </h2>
            <ol className="mt-12 grid lg:grid-cols-4 lg:gap-8">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="relative grid grid-cols-[3.5rem_1fr] gap-4 pb-10 last:pb-0 lg:block lg:pb-0"
                >
                  {index < STEPS.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-14 bottom-0 left-7 border-l-2 border-dashed border-route lg:top-7 lg:-right-8 lg:bottom-auto lg:left-14 lg:border-t-2 lg:border-l-0"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className={`relative flex size-14 items-center justify-center rounded-full border-2 bg-paper-raised text-base font-semibold tabular-nums ${index === 0 ? "border-route text-ink ring-4 ring-route/15" : "border-brand-300 text-brand-800"}`}
                  >
                    {index === 0 ? <LogoMark className="size-8" /> : index + 1}
                  </span>
                  <div className="pt-1 lg:pt-6">
                    <h3 className="text-h3">{step.title}</h3>
                    <p className="text-body mt-2 text-brand-800">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="cta-title" className="pb-16">
          <div className={CONTAINER}>
            <div className="relative overflow-hidden rounded-[1.75rem] bg-brand-700 p-3 sm:p-10">
              <Image
                src="/art/compass-flow.jpg"
                alt=""
                fill
                sizes="(min-width: 1152px) 1088px, 100vw"
                className="object-cover"
              />
              <div className="relative mx-auto max-w-3xl rounded-2xl bg-paper-raised px-5 py-10 text-center shadow-overlay sm:px-12 sm:py-14">
              <h2 id="cta-title" className="text-h-section">
                Start with one{" "}
                <span className="text-brand-700">question</span>
              </h2>
              <p className="text-lead mx-auto mt-5 max-w-xl text-brand-900">
                Campus Compass is still being built. This is where each part
                stands today.
              </p>
              <ButtonLink
                href="/register"
                                size="lg"
                className="mt-9 w-full sm:w-auto"
              >
                Create your account
              </ButtonLink>
              <dl className="mx-auto mt-12 max-w-2xl divide-y divide-brand-300 rounded-xl border border-brand-300 bg-paper-raised text-left">
                {STATUS.map(([name, status]) => (
                  <div key={name} className="flex flex-wrap items-baseline justify-between gap-x-4 px-5 py-3.5">
                    <dt className="text-h4">{name}</dt>
                    <dd className="text-body text-brand-800">{status}</dd>
                  </div>
                ))}
              </dl>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-300">
        <div className={`${CONTAINER} text-caption flex flex-col gap-1 py-7 text-brand-800 sm:flex-row sm:items-center sm:justify-between`}>
          <span className="font-semibold text-brand-950">Campus Compass</span>
          <span>Student knowledge, shared forward.</span>
        </div>
      </footer>
    </div>
  );
}
