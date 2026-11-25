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
                A living map of campus life
              </p>
              <h1
                id="landing-title"
                className="mt-5 max-w-[14ch] text-[clamp(3.1rem,7vw,5.25rem)] leading-[0.91] font-bold tracking-[-0.075em] text-brand-950"
              >
                <span className="block">Nobody hands</span>
                <span className="block text-brand-700">you a map.</span>
                <span className="mt-2 block text-[0.48em] leading-[1.1] font-medium tracking-[-0.045em] text-brand-800">
                  Students draw one together.
                </span>
              </h1>
              <p className="mt-5 max-w-md text-base leading-7 text-brand-800 sm:mt-6 sm:text-lg sm:leading-8">
                Real answers from people who&apos;ve found their way, practical
                guides you can check, and a next step that&apos;s yours.
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
                ASK SOMEONE <span aria-hidden="true">/</span> CHECK THE SOURCE{" "}
                <span aria-hidden="true">/</span> FIND YOUR WAY
              </p>
            </div>

            <aside
              aria-label="Sample community question and response"
              className="relative isolate flex min-h-[390px] items-center justify-center overflow-hidden border-y border-brand-950/15 px-4 py-8 sm:min-h-[480px] sm:border sm:px-8"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 opacity-80"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgb(4 32 46 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(4 32 46 / 0.06) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 480 440"
                className="absolute inset-0 -z-10 h-full w-full text-brand-800/55"
                fill="none"
              >
                <path
                  d="M-20 312C52 290 72 196 147 208s94 118 166 75 78-123 187-107M20 74c78 49 98 99 161 82s93-75 153-40 68 115 148 126M63 462c4-78 54-101 101-96s64 39 111 19 91-91 166-65"
                  stroke="currentColor"
                  strokeDasharray="3 7"
                  strokeWidth="1.5"
                />
                <path
                  d="M25 350c70-30 83-118 147-111s91 100 149 64 77-104 159-92"
                  stroke="#d46747"
                  strokeWidth="3"
                />
                <circle cx="25" cy="350" r="6" fill="#d46747" />
                <circle cx="172" cy="239" r="6" fill="#d46747" />
                <circle cx="321" cy="303" r="6" fill="#d46747" />
                <circle cx="480" cy="211" r="6" fill="#d46747" />
                <path d="M402 34v54m-27-27h54" stroke="currentColor" />
                <circle cx="402" cy="61" r="22" stroke="currentColor" />
                <path d="m402 45 5 16-5 16-5-16 5-16Z" fill="#d46747" />
              </svg>

              <div className="absolute left-4 top-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-brand-800 sm:left-6 sm:top-6">
                <span className="size-2 rounded-full bg-[#d46747]" />
                Student routes / still being drawn
              </div>
              <div className="absolute right-4 top-16 hidden font-mono text-[9px] uppercase tracking-[0.14em] text-brand-800 sm:block">
                <span className="block">01 / Ask</span>
                <span className="mt-2 block">02 / Verify</span>
                <span className="mt-2 block">03 / Go</span>
              </div>

              <article className="relative mt-8 w-full max-w-[350px] -rotate-1 border border-brand-950/15 bg-[#fbfaf6] p-5 shadow-[5px_7px_0_rgb(4_32_46/0.08)] sm:mt-6 sm:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-brand-950/15 pb-3 font-mono text-[9px] uppercase tracking-[0.14em] text-brand-800">
                  <span>Field note / 014</span>
                  <span>Example</span>
                </div>
                <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.15em] text-brand-700">
                  A student asks
                </p>
                <h2 className="mt-2 text-xl leading-7 font-semibold tracking-[-0.035em] text-brand-950 sm:text-2xl sm:leading-8">
                  Two courses clash. Who do I talk to first?
                </h2>
                <div className="mt-4 border-l-2 border-[#d46747] pl-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.13em] text-brand-700">
                    Peer advice / sample
                  </p>
                  <p className="mt-2 text-sm leading-6 text-brand-950">
                    Start with your academic advisor. Ask what options your
                    faculty allows before changing your plan.
                  </p>
                </div>
                <p className="mt-4 border-t border-brand-950/15 pt-3 font-mono text-[9px] uppercase tracking-wide text-brand-700">
                  Personal experience, not an official rule
                </p>
              </article>

              <span className="absolute bottom-4 left-4 font-mono text-[9px] tracking-[0.14em] text-brand-800 sm:bottom-6 sm:left-6">
                YOUR ROUTE STARTS HERE
              </span>
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
