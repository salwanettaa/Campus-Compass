import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExperienceForm } from "@/components/knowledge/experience-form";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Share your experience" };

export default function ShareExperiencePage() {
  return (
    <main className="flex w-full flex-col gap-6">
      <Link
        href="/knowledge"
        className="text-h5 inline-flex w-fit items-center gap-2 rounded-md text-brand-800 hover:underline focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Knowledge Hub
      </Link>
      <PageHeader
        title="Share your experience"
        description="Help new students by describing what you went through, step by step."
      />
      <div className="max-w-3xl">
        <ExperienceForm />
      </div>
    </main>
  );
}
