"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import {
  BookOpen,
  House,
  LogOut,
  Menu,
  MessagesSquare,
  Route,
  Search,
  Signpost,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { openQuickJump } from "./quick-jump";

/** Short labels so five tabs fit a 320px screen. */
const TABS = [
  { href: "/home", label: "Home", icon: House },
  { href: "/journey", label: "Journey", icon: Route },
  { href: "/community", label: "Community", icon: MessagesSquare },
  { href: "/knowledge", label: "Guides", icon: BookOpen },
] as const;

const within = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

const tabClass =
  "flex min-h-14 w-full flex-col items-center justify-center gap-0.5 text-[0.75rem] leading-4";

function TabIcon({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "flex h-7 w-14 max-w-full items-center justify-center rounded-full transition-colors duration-150",
        active ? "bg-brand-100" : "group-active:bg-brand-100",
      )}
    >
      {children}
    </span>
  );
}

/**
 * The phone tab bar, docked to the bottom edge. Tapping the tab you are on
 * scrolls back to the top, and the bar steps aside while the keyboard is up.
 * "More" opens a bottom sheet. Hidden on large screens, which have a sidebar.
 */
export function BottomNav({
  className,
  onLogout,
}: {
  className?: string;
  /** Can be a Server Action (returns a promise). */
  onLogout?: () => void | Promise<void>;
}) {
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const moreActive = within(pathname, "/ai-navigator");

  useEffect(() => {
    sheet.current?.close();
  }, [pathname]);

  useEffect(() => {
    // Text entry opens the on-screen keyboard; the bar would cover the field.
    const typing = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      target.matches(
        "textarea, input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit])",
      ) &&
      !target.closest("dialog");
    const onFocusIn = (event: FocusEvent) => {
      if (typing(event.target)) bar.current?.setAttribute("data-away", "");
    };
    const onFocusOut = () => bar.current?.removeAttribute("data-away");
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  function scrollIfCurrent(event: MouseEvent, href: string) {
    if (pathname !== href || window.location.search) return;
    event.preventDefault();
    // The stylesheet decides whether this scroll is smooth or instant.
    window.scrollTo({ top: 0 });
  }

  const rowClass =
    "flex min-h-14 w-full items-center gap-3.5 rounded-xl px-3 text-left text-brand-950 active:bg-brand-100";

  return (
    <>
      <nav
        ref={bar}
        aria-label="Main (mobile)"
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-brand-300 bg-paper-raised pb-[env(safe-area-inset-bottom)] data-away:hidden lg:hidden",
          className,
        )}
      >
        <ul className="mx-auto grid max-w-lg grid-cols-[1fr_1fr_1.35fr_1fr_1fr]">
          {TABS.map((tab) => {
            const active = within(pathname, tab.href);
            const Icon = tab.icon;
            return (
              <li key={tab.href} className="min-w-0">
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  onClick={(event) => scrollIfCurrent(event, tab.href)}
                  className={cn(
                    "group",
                    tabClass,
                    active ? "font-semibold text-brand-700" : "text-brand-800",
                  )}
                >
                  <TabIcon active={active}>
                    <Icon className="size-5" aria-hidden="true" />
                  </TabIcon>
                  <span className="max-w-full truncate">{tab.label}</span>
                </Link>
              </li>
            );
          })}
          <li className="min-w-0">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-label="More navigation"
              onClick={() => sheet.current?.showModal()}
              className={cn(
                "group",
                tabClass,
                moreActive ? "font-semibold text-brand-700" : "text-brand-800",
              )}
            >
              <TabIcon active={moreActive}>
                <Menu className="size-5" aria-hidden="true" />
              </TabIcon>
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={sheet}
        aria-label="More navigation"
        onClick={(event) => {
          if (event.target === sheet.current) sheet.current?.close();
        }}
        className="sheet bg-paper-raised text-brand-950 backdrop:bg-ink/40 lg:hidden"
      >
        <div className="px-3 pt-2 pb-3">
          <div aria-hidden="true" className="mx-auto h-1 w-10 rounded-full bg-brand-300" />
          <div className="flex items-center justify-between py-1 pl-3">
            <p className="text-h3">More</p>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => sheet.current?.close()}
              className="press flex size-11 items-center justify-center rounded-lg text-brand-800 active:bg-brand-100"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <ul>
            <li>
              <button
                type="button"
                onClick={() => {
                  sheet.current?.close();
                  openQuickJump();
                }}
                className={rowClass}
              >
                <Search className="size-5 shrink-0 text-brand-700" aria-hidden="true" />
                <span className="text-h4">Search or jump to</span>
              </button>
            </li>
            <li>
              <Link
                href="/ai-navigator"
                aria-current={moreActive ? "page" : undefined}
                onClick={() => sheet.current?.close()}
                className={cn(rowClass, moreActive && "bg-brand-100")}
              >
                <Signpost className="size-5 shrink-0 text-brand-700" aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="text-h4">AI Navigator</span>
                  <span className="text-caption text-brand-800">Preview, no live AI yet</span>
                </span>
              </Link>
            </li>
            {onLogout ? (
              <li className="mt-1 border-t border-brand-300 pt-1">
                <button type="button" onClick={onLogout} className={rowClass}>
                  <LogOut className="size-5 shrink-0 text-brand-800" aria-hidden="true" />
                  <span className="text-h4">Log out</span>
                </button>
              </li>
            ) : null}
          </ul>
        </div>
      </dialog>
    </>
  );
}
