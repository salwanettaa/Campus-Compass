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
        "fixed inset-x-3 bottom-3 z-40 rounded-3xl bg-brand-950 px-2 py-2 shadow-nav lg:hidden",
        className,
      )}
    >
      <ul className="flex items-stretch justify-between">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          const Icon = item.icon;
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[0.6875rem] leading-none font-medium transition-colors duration-200",
                  active
                    ? "bg-white/15 text-white"
                    : "text-brand-100/80 hover:text-white",
                )}
              >
                <Icon className="size-5" aria-hidden="true" />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
