import {
  CompassFinder,
  type CompassPoint,
} from "@/components/landing/compass-finder";
import {
  ExamplePreview,
  type PreviewItem,
} from "@/components/landing/example-preview";
import { LandingHeader } from "@/components/landing/landing-header";
import { ButtonLink } from "@/components/ui/button";
import { RouteLine } from "@/components/ui/route-line";
import { MOCK_COMMENTS, MOCK_POSTS } from "@/lib/community/mock-data";
import {
  CATEGORY_INFO,
  PERSONAL_EXPERIENCE_LABEL,
  sourceLabel,
} from "@/lib/knowledge/categories";
import { formatVerifiedDate } from "@/lib/knowledge/filter";
import { MOCK_EXPERIENCES, MOCK_GUIDES } from "@/lib/knowledge/mock-data";
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
  ["AI Navigator", "Layout preview, no AI connected"],
  ["My Journey", "Coming soon"],
] as const;

function previewItems(): PreviewItem[] {
  const post = MOCK_POSTS[0];
  const answer = MOCK_COMMENTS.find(
    (comment) => comment.post_id === post.id && comment.is_accepted_answer,
  );
  const guide = MOCK_GUIDES[3];
  const story = MOCK_EXPERIENCES[0];

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
    {
      label: "Story",
      title: story.title,
      body: `${story.situation} ${story.challenge}`,
      replyLabel: "Advice for juniors",
      reply: story.advice_for_juniors,
      note: PERSONAL_EXPERIENCE_LABEL,
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
      detail: "Official sources, curated guides and senior stories are labelled differently.",
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
        <section aria-labelledby="landing-title" className="pt-28 pb-10 lg:min-h-svh">
          <div className={`${CONTAINER} grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10`}>
            <div className="text-center lg:text-left">
              <h1 id="landing-title" className="text-hero text-brand-950">
                Nobody hands you a map.{" "}
                <span className="block text-brand-700">
                  Students draw one{" "}
                  <em className="font-serif font-normal">together.</em>
                </span>
              </h1>
              <p className="text-lead mx-auto mt-7 max-w-lg text-brand-800 lg:mx-0">
                Ask questions, read guides that show their sources, and learn
                what seniors would do differently.
              </p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <ButtonLink href="/register" variant="pillOnDark" size="lg">
                  Create your account
                </ButtonLink>
                <ButtonLink href="#steps" variant="outline" size="lg">
                  See the route
                </ButtonLink>
              </div>
            </div>
            <CompassFinder points={compassPoints()} />
          </div>
        </section>

        <RouteLine className="h-20 sm:h-28" />

        <section aria-labelledby="check-title" className="py-20 sm:py-28">
          <div className={CONTAINER}>
            <h2 id="check-title" className="text-h-section mx-auto max-w-3xl text-center">
              Advice you can{" "}
              <em className="font-serif font-normal text-brand-700">check</em>
            </h2>
            <p className="text-lead mx-auto mt-4 max-w-xl text-center text-brand-800">
              Know who said it, where it came from, and how old it is.
            </p>
            <div className="mt-14 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <article className="reveal bg-hero-gradient rounded-[2rem] p-3 sm:p-6">
                <div className="rounded-3xl bg-frost p-6 text-ink sm:p-9">
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
                  <div key={check.question} className="reveal relative pl-10">
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

        <section aria-labelledby="preview-title" className="pb-20 sm:pb-28">
          <div className={`${CONTAINER} bg-hero-gradient grid items-center gap-10 rounded-[2.5rem] py-10 sm:py-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14`}>
            <div>
              <h2 id="preview-title" className="text-h-section">
                Learn from{" "}
                <em className="font-serif font-normal text-brand-700">students</em>
              </h2>
              <p className="text-lead mt-4 text-brand-900">
                Switch between a question, a guide, and a senior&apos;s story.
                Questions can have an accepted answer and helpful votes.
              </p>
            </div>
            <ExamplePreview items={previewItems()} />
          </div>
        </section>

        <section id="steps" aria-labelledby="steps-title" className="scroll-mt-24 pb-20 sm:pb-28">
          <div className={CONTAINER}>
            <h2 id="steps-title" className="text-h-section">
              Your route in four steps
            </h2>
            <ol className="mt-12 grid lg:grid-cols-4 lg:gap-8">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="reveal relative grid grid-cols-[3.5rem_1fr] gap-4 pb-10 last:pb-0 lg:block lg:pb-0"
                >
                  {index < STEPS.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-14 bottom-0 left-7 border-l-2 border-dashed border-route lg:top-7 lg:-right-8 lg:bottom-auto lg:left-14 lg:border-t-2 lg:border-l-0"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="flex size-14 items-center justify-center rounded-full border-2 border-brand-600 bg-brand-100 text-base font-semibold text-brand-950 tabular-nums"
                  >
                    {index + 1}
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
            <div className="bg-hero-gradient overflow-hidden rounded-[2.5rem] px-7 pt-12 text-center sm:px-14 sm:pt-20">
              <h2 id="cta-title" className="text-hero">
                Start with one{" "}
                <em className="font-serif font-normal text-brand-700">question</em>
              </h2>
              <p className="text-lead mx-auto mt-5 max-w-xl text-brand-900">
                Campus Compass is still being built. This is where each part
                stands today.
              </p>
              <ButtonLink
                href="/register"
                variant="pillOnDark"
                size="lg"
                className="mt-9 w-full sm:w-auto"
              >
                Create your account
              </ButtonLink>
              <dl className="mt-14 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
                {STATUS.map(([name, status]) => (
                  <div key={name} className="border-t border-white/30 pt-4">
                    <dt className="text-h4">{name}</dt>
                    <dd className="text-body mt-1 text-brand-900">{status}</dd>
                  </div>
                ))}
              </dl>
              <RouteLine className="mt-6 h-20 sm:h-24" />
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
