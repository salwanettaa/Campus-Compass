"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  BookOpen,
  House,
  MessagesSquare,
  Route,
  Search,
  Signpost,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CATEGORY_INFO } from "@/lib/knowledge/categories";
import { GUIDE_CATEGORIES } from "@/lib/knowledge/types";

const OPEN_EVENT = "campus-compass:quick-jump";

type Destination = {
  href: string;
  label: string;
  hint: string;
  icon: LucideIcon;
};

const DESTINATIONS: readonly Destination[] = [
  { href: "/home", label: "Home", hint: "Your focus and tasks", icon: House },
  { href: "/journey", label: "My Journey", hint: "Checklist and notes", icon: Route },
  { href: "/community", label: "Community", hint: "Student questions", icon: MessagesSquare },
  { href: "/knowledge", label: "Knowledge Hub", hint: "Campus guides", icon: BookOpen },
  { href: "/ai-navigator", label: "AI Navigator", hint: "Preview, no live AI yet", icon: Signpost },
  ...GUIDE_CATEGORIES.map((category) => ({
    href: `/knowledge?category=${category}`,
    label: CATEGORY_INFO[category].label,
    hint: "Guide category",
    icon: BookOpen,
  })),
];

/** A button that opens the quick jump dialog. Render it as often as needed. */
export function QuickJumpButton({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label="Search or jump to a page"
      aria-keyshortcuts="Control+K Meta+K"
      title="Search or jump to (Ctrl K)"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
      className={cn(
        "press flex min-h-11 items-center gap-2.5 rounded-lg border border-brand-300 bg-paper text-body text-brand-800 hover:border-brand-400 hover:text-brand-950",
        compact ? "size-11 justify-center" : "w-full px-3",
        className,
      )}
    >
      <Search className="size-4 shrink-0" aria-hidden="true" />
      {compact ? null : (
        <>
          <span className="truncate">Jump to…</span>
          <kbd className="ml-auto rounded-sm border border-brand-300 bg-paper-raised px-1.5 font-sans text-[0.6875rem] leading-5 text-brand-800">
            Ctrl K
          </kbd>
        </>
      )}
    </button>
  );
}

/**
 * Quick jump: go to any page or guide category, or search guides, from the
 * keyboard. A native dialog handles focus trapping and Escape. Mount it once.
 */
export function QuickJumpDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function open() {
      if (dialog.current?.open) return;
      setQuery("");
      dialog.current?.showModal();
      input.current?.focus();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !(event.ctrlKey || event.metaKey)) return;
      event.preventDefault();
      open();
    }
    window.addEventListener(OPEN_EVENT, open);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(OPEN_EVENT, open);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Close after navigating, including to another filter on the same page.
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  const term = query.trim();
  const matches = DESTINATIONS.filter((item) =>
    `${item.label} ${item.hint}`.toLowerCase().includes(term.toLowerCase()),
  );
  const searchHref = `/knowledge?q=${encodeURIComponent(term)}`;

  function submit(event: FormEvent) {
    event.preventDefault();
    const target = matches[0]?.href ?? (term ? searchHref : null);
    if (!target) return;
    dialog.current?.close();
    router.push(target);
  }

  const rowClass =
    "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-brand-950 hover:bg-brand-100 focus-visible:bg-brand-100";

  return (
    <dialog
      ref={dialog}
      aria-label="Search or jump to a page"
      onClick={(event) => {
        // A click on the dialog element itself is a click on the backdrop.
        if (event.target === dialog.current) dialog.current?.close();
      }}
      className="mx-auto mt-[12dvh] w-[min(34rem,calc(100%-2rem))] overflow-hidden rounded-xl border border-brand-300 bg-paper-raised p-0 text-brand-950 shadow-overlay backdrop:bg-ink/40"
    >
      <form onSubmit={submit} className="flex items-center gap-2 border-b border-brand-300 pr-2 pl-4">
        <Search className="size-4 shrink-0 text-brand-800" aria-hidden="true" />
        <input
          ref={input}
          value={query}
          maxLength={100}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Type a page or topic, then press Enter"
          placeholder="Type a page or topic"
          className="h-14 w-full min-w-0 bg-transparent text-base text-brand-950 outline-none placeholder:text-brand-800"
        />
        <button
          type="button"
          aria-label="Close"
          onClick={() => dialog.current?.close()}
          className="press flex size-10 shrink-0 items-center justify-center rounded-lg text-brand-800 hover:bg-brand-100 hover:text-brand-950"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </form>

      <div className="max-h-[55dvh] overflow-y-auto overscroll-contain p-2">
        <ul>
          {matches.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => dialog.current?.close()}
                  className={cn(rowClass, term && index === 0 && "bg-brand-100")}
                >
                  <Icon className="size-4 shrink-0 text-brand-700" aria-hidden="true" />
                  <span className="text-h5">{item.label}</span>
                  <span className="ml-auto truncate text-caption text-brand-800">{item.hint}</span>
                </Link>
              </li>
            );
          })}
          {term ? (
            <li>
              <Link
                href={searchHref}
                onClick={() => dialog.current?.close()}
                className={cn(rowClass, matches.length === 0 && "bg-brand-100")}
              >
                <Search className="size-4 shrink-0 text-brand-700" aria-hidden="true" />
                <span className="min-w-0 truncate text-h5">Search guides for “{term}”</span>
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
      <p className="border-t border-brand-300 bg-paper px-4 py-2 text-caption text-brand-800">
        Enter opens the highlighted result. Tab moves through the list. Esc closes.
      </p>
    </dialog>
  );
}
