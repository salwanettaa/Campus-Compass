"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActive } from "./nav-items";

/** Mobile navigation (hidden on large screens, where the Sidebar is shown). */
export function BottomNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const primaryItems = NAV_ITEMS.filter(
    (item) => item.label !== "My Journey" && item.label !== "AI Navigator",
  );
  const moreItems = NAV_ITEMS.filter(
    (item) => item.label === "My Journey" || item.label === "AI Navigator",
  );
  const moreActive = moreItems.some((item) => isActive(item, pathname));

  return (
    <nav
      aria-label="Main (mobile)"
      className={cn(
        "fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 rounded-2xl bg-brand-950 p-2 shadow-nav lg:hidden",
        className,
      )}
    >
      <ul className="flex items-stretch justify-between gap-0.5">
        {primaryItems.map((item) => {
          const active = isActive(item, pathname);
          const Icon = item.icon;
          return (
            <li key={item.label} className="min-w-0 flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-14 h-full flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1 text-center text-caption font-medium leading-4 transition-colors duration-200",
                  active
                    ? "bg-white/15 text-white"
                    : "text-brand-100/80 hover:text-white",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="max-w-full whitespace-normal">{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="min-w-0 flex-1">
          <button
            type="button"
            aria-expanded={moreOpen}
            aria-controls="mobile-nav-more"
            aria-label={moreOpen ? "Close more navigation" : "More navigation"}
            onClick={() => setMoreOpen((open) => !open)}
            className={cn(
              "flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-2xl px-1 py-1 text-caption font-medium leading-4 transition-colors duration-200",
              moreActive || moreOpen
                ? "bg-white/15 text-white"
                : "text-brand-100/80 hover:text-white",
            )}
          >
            <MoreHorizontal className="size-5" aria-hidden="true" />
            <span>More</span>
          </button>
        </li>
      </ul>
      {moreOpen ? (
        <ul
          id="mobile-nav-more"
          className="absolute right-0 bottom-full mb-3 flex w-56 flex-col gap-1 rounded-2xl bg-brand-950 p-2 shadow-nav"
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
                    "flex min-h-11 items-center gap-3 rounded-lg px-3 text-h5 transition-colors duration-200",
                    active
                      ? "bg-white/15 text-white"
                      : "text-brand-100/85 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Icon className="size-5 text-brand-300" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </nav>
  );
}
