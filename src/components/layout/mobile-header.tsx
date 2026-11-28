import { Logo } from "./logo";
import { QuickJumpButton } from "./quick-jump";

/** Top bar on small screens, where the sidebar is hidden. */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-brand-300 bg-paper-raised px-4 py-2 lg:hidden">
      <Logo href="/home" />
      <QuickJumpButton compact />
    </header>
  );
}
