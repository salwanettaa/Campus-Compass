import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-8 px-4 py-10">
      <Logo tone="onLight" href="/" />
      <main className="flex flex-col items-start gap-4 border-t border-brand-300 pt-6">
        <h1 className="text-h1 text-brand-950">Page not found</h1>
        <p className="text-lead text-brand-800">
          We could not find the page you were looking for. It may have moved, or
          it may not exist yet.
        </p>
        <ButtonLink href="/">Back to Campus Compass</ButtonLink>
      </main>
    </div>
  );
}
