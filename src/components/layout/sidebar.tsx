"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
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
  const [collapsed, setCollapsed] = useState(false);
  const navigationId = useId();

  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-brand-950/10 shadow-none transition-[width] duration-200 motion-reduce:transition-none",
        collapsed ? "w-20" : "w-64",
        dark
          ? "bg-brand-950 text-white"
          : "bg-paper-raised text-brand-950",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center px-5 py-5",
          collapsed ? "flex-col gap-3 px-2" : "justify-between gap-3",
          !dark && "bg-brand-950",
        )}
      >
        <Logo tone="onDark" href="/home" compact={collapsed} />
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          aria-controls={navigationId}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((value) => !value)}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-brand-100 transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:outline-none"
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <nav
        id={navigationId}
        aria-label="Main"
        className="flex flex-1 flex-col gap-1 p-3"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(item, pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active ? "page" : undefined}
              aria-label={collapsed ? item.label : undefined}
              title={collapsed ? item.label : undefined}
              className={cn(
                "flex min-h-11 items-center rounded-lg text-h5 transition-colors duration-200",
                collapsed ? "justify-center px-0" : "gap-3 px-4",
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
              <span className={collapsed ? "sr-only" : "truncate"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "flex flex-col gap-1 p-3",
          dark ? "bg-black/20" : "bg-paper",
        )}
      >
        <div
          className={cn(
            "flex items-center py-2",
            collapsed ? "justify-center" : "gap-3 px-3",
          )}
        >
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full bg-brand-700 text-h5 text-white"
          >
            {initials(user.displayName)}
          </span>
          <span className={collapsed ? "sr-only" : "truncate text-h5 uppercase"}>
            {user.displayName}
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label={collapsed ? "Log out" : undefined}
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "flex min-h-11 items-center rounded-lg text-h5 transition-colors duration-200",
            collapsed ? "justify-center px-0" : "gap-3 px-4",
            dark
              ? "text-brand-100/85 hover:bg-white/10 hover:text-white"
              : "text-brand-800 hover:bg-white hover:text-brand-950",
          )}
        >
          <LogOut className="size-5" aria-hidden="true" />
          <span className={collapsed ? "sr-only" : ""}>Log out</span>
        </button>
      </div>
    </aside>
  );
}
