import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-5 py-10">
      <div className="flex items-center justify-between">
        <Logo tone="onLight" />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-h5 text-brand-800 hover:text-brand-950"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back
        </Link>
      </div>
      <main className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-card sm:p-8">
        {children}
      </main>
    </div>
  );
}
