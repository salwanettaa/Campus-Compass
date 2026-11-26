import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";

/** Floating glass bar. */
export function LandingHeader() {
  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:px-6">
      <div className="liquid-glass mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 rounded-full pr-2 pl-3 sm:pl-5">
        <Logo href="/" />
        <nav aria-label="Main" className="flex items-center gap-1">
          <ButtonLink href="/login" variant="ghost" className="px-4">
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
