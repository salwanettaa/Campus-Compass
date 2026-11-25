"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NAV_ITEMS, isActive } from "./nav-items";

export type NavbarProps = {
  variant?: "dark" | "light";
  logoHref?: string;
  /** Called when the Search entry is pressed. */
  onSearch?: () => void;
  className?: string;
};

export function Navbar({
  variant = "dark",
  logoHref = "/home",
  onSearch,
  className,
}: NavbarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const dark = variant === "dark";

  const linkClass = (active: boolean) =>
    cn(
      "rounded-lg px-3.5 py-2 text-h5 transition-colors duration-200",
      dark
        ? active
          ? "bg-white/15 text-white"
          : "text-brand-100/85 hover:bg-white/10 hover:text-white"
        : active
          ? "bg-brand-100 text-brand-950"
          : "text-brand-800 hover:bg-brand-100 hover:text-brand-950",
    );

  return (
    <header
      className={cn(
        "relative rounded-xl px-5 py-3 shadow-none",
        dark
          ? "bg-brand-950 text-white"
          : "border border-brand-300 bg-white text-brand-950",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <Logo tone={dark ? "onDark" : "onLight"} href={logoHref} />

        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item, pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={linkClass(active)}
              >
                {item.label}
              </Link>
            );
          })}
          {onSearch ? (
            <button
              type="button"
              onClick={onSearch}
              className={linkClass(false)}
            >
              Search
            </button>
          ) : null}
          <ButtonLink
            href="/register"
            size="sm"
            variant={dark ? "pillOnDark" : "pillOnLight"}
            className="ml-2"
          >
            Sign Up
          </ButtonLink>
        </nav>

        <div className="flex items-center gap-1 lg:hidden">
          {onSearch ? (
            <button
              type="button"
              onClick={onSearch}
              aria-label="Search"
              className={cn(
                "flex size-11 items-center justify-center rounded-full",
                dark ? "hover:bg-white/10" : "hover:bg-brand-100",
              )}
            >
              <Search className="size-5" aria-hidden="true" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="navbar-mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className={cn(
              "flex size-11 items-center justify-center rounded-full",
              dark ? "hover:bg-white/10" : "hover:bg-brand-100",
            )}
          >
            {open ? (
              <X className="size-5" aria-hidden="true" />
            ) : (
              <Menu className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="navbar-mobile-menu"
          aria-label="Main (mobile)"
          className="mt-3 flex flex-col gap-1 border-t border-current/15 pt-3 lg:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item, pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={cn(linkClass(active), "py-3")}
              >
                {item.label}
              </Link>
            );
          })}
          <ButtonLink
            href="/register"
            variant={dark ? "pillOnDark" : "pillOnLight"}
            className="mt-2"
          >
            Sign Up
          </ButtonLink>
        </nav>
      ) : null}
    </header>
  );
}
