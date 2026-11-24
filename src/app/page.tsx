import { ArrowDown } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { ButtonLink } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-16 px-5 py-6">
      <Navbar variant="dark" />

      <main className="flex flex-1 flex-col items-start justify-center gap-6 pb-16">
        <p className="text-h5 text-brand-800">
          Student Adaptation &amp; Community Knowledge Platform
        </p>
        <h1 className="text-h1 text-brand-950 sm:text-5xl sm:leading-[3.5rem]">
          Campus Compass
        </h1>
        <p className="max-w-xl text-h4 font-normal text-brand-800">
          Ask, learn from seniors, and get guidance with sources, all in one
          place. Built to help you find your way around campus.
        </p>
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/register" size="lg">
            Get Started
            <ArrowDown className="size-5" aria-hidden="true" />
          </ButtonLink>
          <ButtonLink href="/design-system" variant="outline" size="lg">
            Learn More
          </ButtonLink>
        </div>
      </main>
    </div>
  );
}
