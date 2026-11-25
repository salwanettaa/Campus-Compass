import { ArrowDown, BookOpen, Route, Sparkles, Users } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { ButtonLink } from "@/components/ui/button";

const PILLARS = [
  {
    title: "Community Q&A",
    icon: Users,
    description:
      "Reddit-inspired student discussion forum. Ask questions anonymously or openly, get helpful votes, and find verified accepted answers.",
  },
  {
    title: "Knowledge Hub",
    icon: BookOpen,
    description:
      "6 curated categories of campus essentials, from academic survival and KRS rules to scholarships and career preparation.",
  },
  {
    title: "Structured Senior Experiences",
    icon: Route,
    description:
      "Glassdoor-style structured stories from seniors with Situation, Challenge, Solution, and actionable Advice for juniors.",
  },
  {
    title: "AI Campus Navigator",
    icon: Sparkles,
    description:
      "AI assistant powered by Google Gemini and RAG that answers academic questions with grounded citations from official handbooks.",
  },
] as const;

export default function LandingPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-5 py-6">
      <Navbar variant="dark" />

      <main className="flex flex-1 flex-col items-start justify-center gap-6 pb-8">
        <p className="text-h5 text-brand-800">
          Student Adaptation &amp; Community Knowledge Platform
        </p>
        <h1 className="text-h1 text-brand-950 sm:text-5xl sm:leading-[3.5rem]">
          Campus Compass
        </h1>
        <p className="max-w-xl text-h4 font-normal text-brand-800">
          Ask, learn from seniors, and get guidance with sources, all in one
          place. Built to help you find your way around campus.
        </p>
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/register" size="lg">
            Get Started
            <ArrowDown className="size-5" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="#features" variant="outline" size="lg">
            Learn More
          </ButtonLink>
        </div>
      </main>

      <section id="features" className="flex flex-col gap-8 pb-16 pt-6">
        <div className="flex flex-col gap-2">
          <p className="text-h5 text-brand-700">Platform Features</p>
          <h2 className="text-h2 text-brand-950">
            Four Core Pillars Built for Student Adaptation
          </h2>
          <p className="max-w-2xl text-body text-brand-800">
            Everything you need to navigate academics, find campus communities,
            and thrive in your university journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="flex flex-col gap-4 rounded-3xl border border-brand-100 bg-white p-6 shadow-card transition-shadow hover:shadow-lg"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-900">
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="text-h4 font-semibold text-brand-950">
                  {pillar.title}
                </h3>
                <p className="text-body text-brand-800">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
