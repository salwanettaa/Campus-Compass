import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  BookOpenText,
  MessageCircle,
  Route,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { ButtonLink } from "@/components/ui/button";

const STEPS = [
  {
    number: "01",
    label: "ASK",
    title: "Start with a real question.",
    description:
      "Ask the community about the parts of campus life no handbook explains.",
    icon: MessageCircle,
  },
  {
    number: "02",
    label: "FIND",
    title: "Keep the useful bits.",
    description:
      "Browse practical guides and student experiences, with sources kept in view.",
    icon: BookOpenText,
  },
  {
    number: "03",
    label: "MOVE",
    title: "Choose your next step.",
    description:
      "Turn what you learn into a plan that makes sense for your own journey.",
    icon: Route,
  },
] as const;

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f5f3ec] text-brand-950">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col px-4 pb-6 pt-4 sm:px-8 sm:pt-6">
        <Navbar
          variant="light"
          logoHref="/"
          className="rounded-xl border-[#d6d7ce] bg-[#f8f7f2]/90 px-4 py-2 shadow-none"
        />

        <main className="flex-1">
          <section
            aria-labelledby="landing-title"
            className="grid gap-8 pb-12 pt-9 sm:gap-10 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14 lg:pb-20 lg:pt-16"
          >
            <div className="relative z-10">
              <p className="flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.17em] text-brand-800">
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-[#d46747]"
                />
                A field guide for campus life
              </p>
              <h1
                id="landing-title"
                className="mt-5 max-w-[12ch] text-[clamp(2.75rem,8vw,5.5rem)] leading-[0.98] font-bold tracking-[-0.065em] text-brand-950"
              >
                <span className="block">The stuff they</span>
                <span className="block text-brand-700">don&apos;t put in</span>
                <span className="block">the handbook.</span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-brand-800 sm:mt-6 sm:text-lg sm:leading-8">
                Ask students who&apos;ve been there. Find guides with their
                sources. Turn what you learn into a next step.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <ButtonLink
                  href="/register"
                  variant="pillOnLight"
                  size="lg"
                  className="w-full rounded-lg sm:w-auto"
                >
                  Find your starting point
                  <ArrowRight className="size-5" aria-hidden="true" />
                </ButtonLink>
                <Link
                  href="#how"
                  className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg border border-brand-950/20 px-6 text-sm font-semibold text-brand-950 transition-colors hover:bg-white/70"
                >
                  See how it works
                  <ArrowDown className="size-4" aria-hidden="true" />
                </Link>
              </div>
              <p className="mt-6 font-mono text-[10px] tracking-[0.13em] text-brand-800/80">
                QUESTIONS <span aria-hidden="true">/</span> GUIDES{" "}
                <span aria-hidden="true">/</span> NEXT STEPS
              </p>
            </div>

            <aside
              aria-label="Sample community question and response"
              className="relative flex min-h-[480px] flex-col bg-brand-950 px-5 py-5 text-white sm:min-h-[510px] sm:px-8 sm:py-7"
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/20 pb-4 font-mono text-[10px] tracking-[0.14em] text-white/75">
                <span>FIELD NOTE / STUDY PLANNING</span>
                <span className="inline-flex items-center gap-2 whitespace-nowrap">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-[#e6a56c]"
                  />
                  EXAMPLE
                </span>
              </div>

              <div className="mt-7 grid grid-cols-[2rem_1fr] gap-x-3 sm:mt-9">
                <span className="font-mono text-xs text-[#e6a56c]">01</span>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.16em] text-[#a8d8eb]">
                    A STUDENT ASKS
                  </p>
                  <h2 className="mt-2 max-w-md text-xl leading-7 font-semibold tracking-[-0.025em] sm:text-2xl sm:leading-8">
                    How do I fix a clash between two courses in my study plan?
                  </h2>
                </div>
              </div>

              <article className="mt-5 ml-5 border-l-2 border-[#e6a56c] bg-[#f5f3ec] p-4 text-brand-950 sm:ml-8 sm:p-5">
                <p className="font-mono text-[10px] tracking-[0.14em] text-brand-700">
                  SAMPLE RESPONSE / PEER ADVICE
                </p>
                <p className="mt-2 text-sm leading-6">
                  Talk to your academic advisor first. They can tell you
                  whether the clash is allowed and which form the faculty
                  office needs.
                </p>
                <p className="mt-3 border-t border-brand-950/15 pt-2 font-mono text-[9px] uppercase tracking-wide text-brand-700">
                  Personal experience, not an official rule
                </p>
              </article>

              <div className="mt-auto border-t border-white/25 pt-4 sm:pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-mono text-[10px] tracking-[0.14em] text-[#a8d8eb]">
                    ASK / CHECK / TAKE A NEXT STEP
                  </p>
                  <span className="text-sm text-white/90">
                    Your path, at your pace.
                  </span>
                </div>
              </div>
            </aside>
          </section>

          <section
            id="how"
            aria-labelledby="how-title"
            className="scroll-mt-6 border-t border-brand-950/20 py-10 sm:py-14"
          >
            <div className="mb-7 flex flex-col gap-3 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[10px] tracking-[0.16em] text-brand-800">
                  THE IDEA / 01—03
                </p>
                <h2
                  id="how-title"
                  className="mt-2 max-w-xl text-3xl leading-tight font-semibold tracking-[-0.045em] sm:text-4xl"
                >
                  Find a way through,
                  <br className="hidden sm:block" /> one question at a time.
                </h2>
              </div>
              <p className="max-w-sm text-sm leading-6 text-brand-800">
                Campus knowledge is better when it is shared, searchable, and
                connected to what you can do next.
              </p>
            </div>

            <ol className="grid sm:grid-cols-3 sm:divide-x sm:divide-brand-950/15">
              {STEPS.map(({ number, label, title, description, icon: Icon }) => (
                <li
                  key={number}
                  className="border-t border-brand-950/15 py-5 first:pt-5 sm:border-t-0 sm:px-6 sm:py-2 sm:first:pl-0 sm:last:pr-0"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs tracking-[0.12em] text-brand-800">
                      {number} / {label}
                    </span>
                    <Icon
                      className="size-5 text-brand-700"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em]">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-brand-800">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </main>

        <footer className="flex flex-col gap-2 border-t border-brand-950/15 pt-4 text-xs text-brand-800 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold tracking-tight text-brand-950">
            Campus Compass
          </span>
          <span>Student knowledge, shared forward.</span>
        </footer>
      </div>
    </div>
  );
}
