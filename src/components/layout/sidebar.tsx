"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState } from "react";
import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NAV_ITEMS, isActive } from "./nav-items";
import { QuickJumpButton } from "./quick-jump";

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
  const quiet = dark
    ? "text-brand-100 hover:bg-white/10 hover:text-white active:bg-white/20"
    : "text-brand-800 hover:bg-brand-100 hover:text-brand-950 active:bg-brand-300";

  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden",
        collapsed ? "w-[4.75rem]" : "w-64",
        dark
          ? "border-ink bg-ink text-white"
          : "border-r border-brand-300 bg-paper-raised text-brand-950",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center pb-4",
          collapsed ? "flex-col gap-2" : "justify-between gap-1 pl-[0.8125rem]",
        )}
      >
        <Logo tone={dark ? "onDark" : "onLight"} href="/home" compact={collapsed} />
        <button
          type="button"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
          aria-controls={navigationId}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((value) => !value)}
          className={cn("flex size-10 shrink-0 items-center justify-center rounded-lg", quiet)}
        >
          {collapsed ? (
            <PanelLeftOpen className="size-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>

      <QuickJumpButton compact={collapsed} className={cn("mb-4 shrink-0", collapsed && "self-center")} />

      <nav
        id={navigationId}
        aria-label="Main"
        className="flex flex-1 flex-col gap-1 overflow-y-auto"
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
                "press flex min-h-11 shrink-0 items-center rounded-lg border border-transparent text-body",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                active
                  ? dark
                    ? "bg-white/15 font-semibold text-white"
                    : "border-brand-600/40 bg-brand-100 font-semibold text-brand-700"
                  : quiet,
              )}
            >
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className={collapsed ? "sr-only" : "truncate"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "mt-3 flex flex-col gap-1 border-t pt-3",
          dark ? "border-white/20" : "border-brand-300",
        )}
      >
        <div
          className={cn(
            "flex items-center py-2",
            collapsed ? "justify-center" : "gap-3 px-[0.8125rem]",
          )}
        >
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-h5 font-semibold text-brand-700"
          >
            {initials(user.displayName)}
          </span>
          <span className={collapsed ? "sr-only" : "truncate text-h5"}>
            {user.displayName}
          </span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          aria-label={collapsed ? "Log out" : undefined}
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "flex min-h-11 items-center rounded-lg text-body",
            collapsed ? "justify-center px-0" : "gap-3 px-[0.8125rem]",
            quiet,
          )}
        >
          <LogOut className="size-5" aria-hidden="true" />
          <span className={collapsed ? "sr-only" : ""}>Log out</span>
        </button>
      </div>
    </aside>
  );
}
