import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid w-full flex-1 lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden flex-col justify-between gap-10 bg-hero-gradient p-10 text-white lg:flex xl:p-14">
        <Logo tone="onDark" href="/" />
        <div className="max-w-md">
          <p className="text-h1">
            <span className="block">Nobody hands you a map.</span>
            <span className="block text-brand-300">Students draw one together.</span>
          </p>
          <p className="text-lead mt-5 text-white">
            Find practical answers, keep useful sources close, and choose a next
            step that fits your campus life.
          </p>
        </div>
        <p className="text-caption border-t border-white/40 pt-4 text-white">
          Student knowledge, shared forward.
        </p>
      </aside>

      <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 py-4 sm:py-6">
        <header className="flex items-center justify-between gap-3">
          <span className="lg:hidden">
            <Logo tone="onLight" href="/" />
          </span>
          <Link
            href="/"
            className="text-h5 ml-auto inline-flex min-h-11 items-center gap-1.5 rounded-md whitespace-nowrap text-brand-800 hover:text-brand-950"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>
              Back<span className="max-[419px]:sr-only"> to home</span>
            </span>
          </Link>
        </header>
        <main className="flex flex-1 flex-col justify-center gap-6 pb-10">
          {children}
        </main>
      </div>
    </div>
  );
}
