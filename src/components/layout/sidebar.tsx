"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NAV_ITEMS, isActive } from "./nav-items";

export type SidebarUser = {
  /** Display name (pseudonym) - never a real full name or student ID (UU PDP). */
  displayName: string;
};

export type SidebarProps = {
  variant?: "light" | "dark";
  user: SidebarUser;
  /** Can be a Server Action (returns a promise). */
  onLogout?: () => void | Promise<void>;
  className?: string;
};

function initials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Sidebar({
  variant = "light",
  user,
  onLogout,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const dark = variant === "dark";

  return (
    <aside
      className={cn(
        "flex w-64 flex-col overflow-hidden rounded-3xl shadow-card",
        dark
          ? "bg-linear-to-b from-brand-950 via-brand-900 to-brand-800 text-white"
          : "bg-white text-brand-950",
        className,
      )}
    >
      <div
        className={cn(
          "px-5 py-5",
          !dark && "bg-linear-to-b from-brand-900 to-brand-800",
        )}
      >
        <Logo tone="onDark" href="/home" />
      </div>

      <nav aria-label="Main" className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-h5 transition-colors duration-200",
                dark
                  ? active
                    ? "bg-white/15 text-white"
                    : "text-brand-100/85 hover:bg-white/10 hover:text-white"
                  : active
                    ? "bg-brand-100 text-brand-950"
                    : "text-brand-800 hover:bg-brand-100/70 hover:text-brand-950",
              )}
            >
              <Icon
                className={cn(
                  "size-5",
                  dark ? "text-brand-300" : "text-brand-600",
                )}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "flex flex-col gap-1 p-3",
          dark ? "bg-black/20" : "bg-brand-100",
        )}
      >
        <div className="flex items-center gap-3 px-3 py-2">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full bg-brand-700 text-h5 text-white"
          >
            {initials(user.displayName)}
          </span>
          <span className="truncate text-h5 uppercase">{user.displayName}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className={cn(
            "flex items-center gap-3 rounded-2xl px-4 py-2.5 text-h5 transition-colors duration-200",
            dark
              ? "text-brand-100/85 hover:bg-white/10 hover:text-white"
              : "text-brand-800 hover:bg-white hover:text-brand-950",
          )}
        >
          <LogOut className="size-5" aria-hidden="true" />
          Log out
        </button>
      </div>
    </aside>
  );
}
