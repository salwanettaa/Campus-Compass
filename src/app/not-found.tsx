import { Compass } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-5 py-10">
      <Logo tone="onLight" />
      <main className="flex flex-col items-start gap-4 rounded-3xl bg-white p-8 shadow-card">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-800">
          <Compass className="size-6" aria-hidden="true" />
        </span>
        <h1 className="text-h2 text-brand-950">Page not found</h1>
        <p className="text-body text-brand-800">
          We could not find the page you were looking for. It may have moved, or
          it may not exist yet.
        </p>
        <ButtonLink href="/home">Back to Home</ButtonLink>
      </main>
    </div>
  );
}
