import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { LogoMark } from "@/components/ui/logo-mark";
import { sourceLabel } from "@/lib/knowledge/categories";
import { MOCK_GUIDES } from "@/lib/knowledge/mock-data";

const ART = "/art/compass-flow.jpg";

/** Split screen: the form on the left, the compass artwork on the right. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const sample = MOCK_GUIDES[0];

  return (
    <div className="grid w-full flex-1 grid-cols-1 bg-paper-raised lg:grid-cols-2">
      <div className="flex min-w-0 flex-col px-5 py-4 sm:px-10 sm:py-6">
        <header className="flex items-center justify-between gap-3">
          <Logo href="/" />
          <Link
            href="/"
            className="text-h5 inline-flex min-h-11 items-center gap-1.5 rounded-lg whitespace-nowrap text-brand-800 hover:text-brand-950"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>
              Back<span className="max-[419px]:sr-only"> to home</span>
            </span>
          </Link>
        </header>

        <div className="relative mt-3 h-36 overflow-hidden rounded-2xl bg-brand-700 sm:h-44 lg:hidden [@media(max-height:34rem)]:hidden">
          <Image
            src={ART}
            alt=""
            fill
            sizes="(min-width: 1024px) 1px, 100vw"
            loading="eager"
            className="art-settle object-cover object-[60%_25%]"
          />
          <p className="text-h3 relative max-w-[15rem] p-4 text-white">
            Nobody hands you a map. Students draw one together.
          </p>
        </div>

        <main className="auth-form auth-stagger mx-auto flex w-full max-w-[28rem] flex-1 flex-col gap-5 pt-6 pb-8 lg:justify-center lg:gap-6 lg:py-10">
          {children}
        </main>
      </div>

      <aside className="hidden p-4 lg:sticky lg:top-0 lg:block lg:h-dvh">
        <div className="relative flex h-full min-h-[36rem] flex-col justify-between gap-6 overflow-hidden rounded-[1.75rem] bg-brand-700 p-8 xl:p-10">
          <Image
            src={ART}
            alt=""
            fill
            sizes="50vw"
            loading="eager"
            fetchPriority="high"
            className="art-settle object-cover object-[70%_30%]"
          />

          <p className="text-h-section relative max-w-md text-white">
            Nobody hands you a map. Students draw one together.
          </p>

          <ul className="auth-cards relative grid gap-3 xl:grid-cols-2">
            <li className="glass-card flex flex-col gap-2 rounded-2xl p-4">
              <p className="text-caption text-brand-900">Sample guide</p>
              <p className="text-h4 text-brand-950">{sample.title}</p>
              <p className="text-caption mt-auto flex items-center gap-1.5 text-brand-900">
                <ShieldCheck className="size-4 shrink-0 text-brand-700" aria-hidden="true" />
                {sourceLabel(sample.source_type)}
              </p>
            </li>
            <li className="glass-card flex flex-col gap-2 rounded-2xl p-4">
              <LogoMark className="size-7 text-ink" />
              <p className="text-h4 text-brand-950">No student ID needed</p>
              <p className="text-caption text-brand-900">
                An email and a nickname are enough to create your account.
              </p>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
