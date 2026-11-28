import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";

/** Sticky top bar. A hairline separates it from the page. */
export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-brand-300 bg-paper-raised">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-8">
        <Logo href="/" />
        <nav aria-label="Main" className="flex items-center gap-2">
          <ButtonLink href="/login" variant="ghost" className="px-3">
            Log in
          </ButtonLink>
          <ButtonLink href="/register" className="hidden sm:inline-flex">
            Create account
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
