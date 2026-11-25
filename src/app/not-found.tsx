import { Compass } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-4 py-10">
      <Logo tone="onLight" href="/" />
      <main className="flex flex-col items-start gap-4 border border-brand-950/10 border-l-4 border-l-brand-600 bg-paper-raised p-6 sm:p-8">
        <span className="flex size-11 items-center justify-center border border-brand-950/10 bg-paper text-brand-800">
          <Compass className="size-6" aria-hidden="true" />
        </span>
        <h1 className="text-h2 text-brand-950">Page not found</h1>
        <p className="text-body text-brand-800">
          We could not find the page you were looking for. It may have moved, or
          it may not exist yet.
        </p>
        <ButtonLink href="/">Back to Campus Compass</ButtonLink>
      </main>
    </div>
  );
}
