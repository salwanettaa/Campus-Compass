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
  const quiet = dark
    ? "text-brand-100 hover:bg-white/10 hover:text-white active:bg-white/20"
    : "text-brand-800 hover:bg-brand-100 hover:text-brand-950 active:bg-brand-300";

  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden transition-[width] duration-200",
        collapsed ? "w-20" : "w-60",
        dark
          ? "border-ink bg-ink text-white"
          : "border-r border-brand-300 text-brand-950",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center pb-6",
          collapsed ? "flex-col gap-2" : "justify-between gap-2",
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
          className={cn("flex size-11 shrink-0 items-center justify-center rounded-md", quiet)}
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
                "flex min-h-11 shrink-0 items-center rounded-xl text-body transition-colors duration-150",
                collapsed ? "justify-center px-0" : "gap-3 px-3",
                active
                  ? dark
                    ? "bg-white/15 font-semibold text-white"
                    : "bg-fill font-semibold text-white"
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
            collapsed ? "justify-center" : "gap-3 px-3",
          )}
        >
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fill text-h5 text-white"
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
            "flex min-h-11 items-center rounded-md text-body",
            collapsed ? "justify-center px-0" : "gap-3 px-3",
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
