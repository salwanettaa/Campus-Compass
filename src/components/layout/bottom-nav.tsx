"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, isActive } from "./nav-items";

/** Mobile navigation (hidden on large screens, where the Sidebar is shown). */
export function BottomNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main (mobile)"
      className={cn(
        "fixed inset-x-2 bottom-3 z-40 rounded-3xl bg-brand-950 px-1 py-2 shadow-nav lg:hidden",
        className,
      )}
    >
      <ul className="flex items-stretch justify-between gap-0.5">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          const Icon = item.icon;
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center gap-1 rounded-2xl px-0.5 py-2 text-center text-caption font-medium transition-colors duration-200",
                  active
                    ? "bg-white/15 text-white"
                    : "text-brand-100/80 hover:text-white",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="max-w-full leading-4 wrap-break-word">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
