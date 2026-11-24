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
      <header className="flex flex-col gap-1">
        <h1 className="text-h2 text-brand-950">Share your experience</h1>
        <p className="text-body text-brand-800">
          Help new students by describing what you went through, step by step.
        </p>
      </header>
      <div className="rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <ExperienceForm />
      </div>
    </main>
  );
}
