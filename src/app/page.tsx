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
import { CATEGORY_INFO, PERSONAL_EXPERIENCE_LABEL } from "@/lib/knowledge/categories";
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

/** Things the current interface already shows (on sample content). */
const FEATURES = [
  ["Ask without the handbook", "Post the question you can't find an answer to."],
  ["Accepted answers", "The reply that solved the problem is marked."],
  ["Helpful votes", "See which advice other students found useful."],
  ["Sources in view", "Guides say where their information comes from."],
  ["Check dates", "Older guides are flagged as possibly outdated."],
  ["Stories from seniors", "What happened, what they did, and their advice."],
] as const;

const CONTAINER = "mx-auto w-full max-w-6xl px-4 sm:px-8";

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <LandingHeader />

      <main className="flex-1">
        <section
          aria-labelledby="landing-title"
          className="bg-hero-gradient flex flex-col overflow-hidden pt-24 pb-4 text-white lg:min-h-[min(100svh,50rem)]"
        >
          <div className={`${CONTAINER} grid flex-1 items-center gap-12 py-8 lg:grid-cols-[1.15fr_1fr] lg:gap-10 lg:py-3`}>
            <div>
              <h1 id="landing-title" className="text-display">
                <span className="block">Nobody hands you a map.</span>
                <span className="mt-1 block text-brand-300">Students draw one together.</span>
              </h1>
              <p className="text-lead mt-6 max-w-xl text-brand-100">
                Ask questions, read guides that show their sources, and learn
                what seniors would do differently.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink
                  href="/register"
                  variant="pillOnDark"
                  size="lg"
                  className="focus-visible:outline-white"
                >
                  Create your account
                </ButtonLink>
                <ButtonLink
                  href="#steps"
                  size="lg"
                  variant="ghost"
                  className="border border-white/50 text-white hover:bg-white/15 active:bg-white/25 focus-visible:outline-white"
                >
                  See the route
                </ButtonLink>
              </div>
            </div>
            <CompassFinder points={compassPoints()} />
          </div>
          <RouteLine className="h-20 sm:h-28" />
        </section>

        <section aria-labelledby="features-title" className="py-16 sm:py-24">
          <div className={CONTAINER}>
            <h2 id="features-title" className="text-h1 max-w-2xl">
              Advice you can check
            </h2>
            <p className="text-lead mt-3 text-brand-800">
              Know who said it, where it came from, and how old it is.
            </p>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(([title, description]) => (
                <li key={title} className="reveal bg-card-tint rounded-md border border-brand-300 p-6">
                  <h3 className="text-h3">{title}</h3>
                  <p className="text-body mt-2 text-brand-800">{description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section aria-labelledby="preview-title" className="pb-16 sm:pb-24">
          <div className={`${CONTAINER} grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14`}>
            <div>
              <h2 id="preview-title" className="text-h1">
                Learn from students
              </h2>
              <p className="text-lead mt-3 text-brand-800">
                Switch between a question, a guide, and a senior&apos;s story.
              </p>
            </div>
            {/* The coloured backdrop gives the glass panel something to refract. */}
            <div className="bg-hero-gradient rounded-[2rem] p-3 sm:p-8">
              <ExamplePreview items={previewItems()} />
            </div>
          </div>
        </section>

        <section id="steps" aria-labelledby="steps-title" className="scroll-mt-24 pb-16 sm:pb-24">
          <div className={CONTAINER}>
            <h2 id="steps-title" className="text-h1">
              Your route in four steps
            </h2>
            <ol className="mt-10">
              {STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="reveal relative grid grid-cols-[3rem_1fr] gap-4 pb-10 last:pb-0 sm:grid-cols-[4rem_1fr] sm:gap-6"
                >
                  {index < STEPS.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute top-12 bottom-0 left-6 border-l-2 border-dashed border-route sm:top-16 sm:left-8"
                    />
                  ) : null}
                  <span
                    aria-hidden="true"
                    className="bg-brand-gradient flex size-12 items-center justify-center rounded-full text-sm font-semibold text-white tabular-nums sm:size-16 sm:text-base"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1 sm:pt-3">
                    <h3 className="text-h2">{step.title}</h3>
                    <p className="text-lead mt-1 text-brand-800">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="cta-title" className="pb-16">
          <div className={CONTAINER}>
            <div className="bg-hero-gradient rounded-[2rem] p-7 text-white sm:p-14">
              <h2 id="cta-title" className="text-h1">
                Start with one question
              </h2>
              <p className="text-lead mt-3 max-w-xl text-brand-100">
                Campus Compass is still being built. This is where each part
                stands today.
              </p>
              <dl className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {STATUS.map(([name, status]) => (
                  <div key={name} className="border-t border-white/30 pt-4">
                    <dt className="text-h3">{name}</dt>
                    <dd className="text-body mt-1 text-brand-100">{status}</dd>
                  </div>
                ))}
              </dl>
              <ButtonLink
                href="/register"
                variant="pillOnDark"
                size="lg"
                className="mt-9 w-full focus-visible:outline-white sm:w-auto"
              >
                Create your account
              </ButtonLink>
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
