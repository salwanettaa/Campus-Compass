import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-4 sm:px-6 sm:py-6 lg:grid-cols-[1.05fr_0.85fr]">
      <aside className="relative hidden min-h-[680px] flex-col justify-between overflow-hidden bg-brand-950 p-8 text-white lg:flex xl:p-10">
        <Logo tone="onDark" href="/" />
        <div className="relative max-w-xl">
          <p className="font-mono text-[10px] tracking-[0.16em] text-brand-300">
            CAMPUS COMPASS / STUDENT LIFE
          </p>
          <h2 className="mt-4 text-5xl leading-[1.04] font-semibold tracking-[-0.06em] xl:text-6xl">
            What the handbook misses, students remember.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-brand-100">
            Find practical answers, keep useful sources close, and choose a
            next step that fits your campus life.
          </p>
        </div>
        <p className="border-t border-white/20 pt-4 font-mono text-[10px] tracking-[0.14em] text-brand-300">
          COMMUNITY / KNOWLEDGE / YOUR JOURNEY
        </p>
      </aside>

      <div className="mx-auto flex w-full max-w-md flex-col justify-center gap-5 lg:max-w-none lg:px-7">
        <header className="flex min-h-11 items-center justify-between gap-4">
          <span className="lg:hidden">
            <Logo tone="onLight" href="/" />
          </span>
          <span className="hidden font-mono text-[10px] tracking-[0.14em] text-brand-700 lg:inline">
            ACCOUNT / CAMPUS COMPASS
          </span>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-1.5 text-sm text-brand-800 hover:text-brand-950"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to home
          </Link>
        </header>
        <main className="flex flex-col gap-6 border border-brand-950/10 bg-paper-raised p-5 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
