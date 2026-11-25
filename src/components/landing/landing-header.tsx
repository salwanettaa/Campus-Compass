"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/layout/logo";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Floating glass bar: dark glass over the hero, light glass once scrolled. */
export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-3 z-40 px-3 sm:px-6">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 rounded-full pr-2 pl-3 sm:pl-5",
          scrolled ? "liquid-glass" : "liquid-glass-dark",
        )}
      >
        <Logo tone={scrolled ? "onLight" : "onDark"} href="/" />
        <nav aria-label="Main" className="flex items-center gap-1">
          <ButtonLink
            href="/login"
            variant="ghost"
            className={cn(
              "px-4",
              !scrolled && "text-white hover:bg-white/15 active:bg-white/25 focus-visible:outline-white",
            )}
          >
            Log in
          </ButtonLink>
          <ButtonLink
            href="/register"
            variant={scrolled ? "primary" : "pillOnDark"}
            className="hidden sm:inline-flex"
          >
            Create account
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
