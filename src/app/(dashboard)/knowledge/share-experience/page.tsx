import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExperienceForm } from "@/components/knowledge/experience-form";

export const metadata: Metadata = { title: "Share your experience" };

export default function ShareExperiencePage() {
  return (
    <main className="flex flex-col gap-6">
      <Link
        href="/knowledge"
        className="text-h5 inline-flex w-fit items-center gap-2 rounded-md text-brand-800 hover:underline focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Knowledge Hub
      </Link>
      <header className="flex flex-col gap-2 border-b border-brand-950/15 pb-5">
        <p className="font-mono text-[10px] tracking-[0.16em] text-brand-700">
          KNOWLEDGE HUB / YOUR STORY
        </p>
        <h1 className="text-3xl leading-tight font-semibold tracking-[-0.05em] text-brand-950 sm:text-4xl">
          Share your experience
        </h1>
        <p className="text-body max-w-xl text-brand-800">
          Help new students by describing what you went through, step by step.
        </p>
      </header>
      <div className="rounded-xl border border-brand-950/10 bg-paper-raised p-5 sm:p-8">
        <ExperienceForm />
      </div>
    </main>
  );
}
