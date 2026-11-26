"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type KeyboardEvent } from "react";
import { LogOut, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActive } from "./nav-items";

const MORE_LABELS = new Set(["AI Navigator"]);

const itemClass = (active: boolean) =>
  cn(
    "flex h-full min-h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1 text-center text-[0.6875rem] leading-4 transition-colors duration-150",
    active
      ? "bg-fill font-semibold text-white"
      : "text-brand-800 hover:bg-brand-100 hover:text-brand-950 active:bg-brand-300",
  );

/** Mobile navigation (hidden on large screens, where the Sidebar is shown). */
export function BottomNav({
  className,
  onLogout,
}: {
  className?: string;
  /** Can be a Server Action (returns a promise). */
  onLogout?: () => void | Promise<void>;
}) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreButton = useRef<HTMLButtonElement>(null);
  const primaryItems = NAV_ITEMS.filter((item) => !MORE_LABELS.has(item.label));
  const moreItems = NAV_ITEMS.filter((item) => MORE_LABELS.has(item.label));
  const moreActive = moreItems.some((item) => isActive(item, pathname));

  function closeOnEscape(event: KeyboardEvent) {
    if (event.key !== "Escape" || !moreOpen) return;
    setMoreOpen(false);
    moreButton.current?.focus();
  }

  return (
    <nav
      aria-label="Main (mobile)"
      onKeyDown={closeOnEscape}
      className={cn(
        "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 lg:hidden",
        className,
      )}
    >
      {/* Glass sits on the bar itself so the menu above can blur the page too. */}
      <ul className="liquid-glass flex items-stretch justify-between gap-1 rounded-3xl p-1.5">
        {primaryItems.map((item) => {
          const active = isActive(item, pathname);
          const Icon = item.icon;
          return (
            <li key={item.label} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={itemClass(active)}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="max-w-full">{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="min-w-0 flex-1">
          <button
            ref={moreButton}
            type="button"
            aria-expanded={moreOpen}
            aria-controls="mobile-nav-more"
            aria-label={moreOpen ? "Close more navigation" : "More navigation"}
            onClick={() => setMoreOpen((open) => !open)}
            className={itemClass(moreActive || moreOpen)}
          >
            <MoreHorizontal className="size-5" aria-hidden="true" />
            <span>More</span>
          </button>
        </li>
      </ul>
      {moreOpen ? (
        <ul
          id="mobile-nav-more"
          className="absolute right-0 bottom-full mb-2 flex w-56 flex-col gap-1 rounded-md border border-brand-300 bg-paper-raised p-2"
        >
          {moreItems.map((item) => {
            const active = isActive(item, pathname);
            const Icon = item.icon;
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMoreOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center gap-3 rounded-md px-3 text-body",
                    active
                      ? "bg-brand-100 font-semibold text-brand-900"
                      : "text-brand-900 hover:bg-brand-100",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
          {onLogout ? (
            <li className="border-t border-brand-300 pt-1">
              <button
                type="button"
                onClick={onLogout}
                className="flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-body text-brand-900 hover:bg-brand-100"
              >
                <LogOut className="size-5" aria-hidden="true" />
                Log out
              </button>
            </li>
          ) : null}
        </ul>
      ) : null}
    </nav>
  );
}
