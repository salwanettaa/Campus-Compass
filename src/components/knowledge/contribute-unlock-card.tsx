import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/** Quiet prompt encouraging students to contribute their own STAR story. */
export function ContributeUnlockCard() {
  return (
    <aside
      aria-labelledby="contribute-unlock-title"
      className="flex flex-col justify-between gap-4 rounded-md border border-brand-300 bg-paper-raised p-5 sm:flex-row sm:items-center sm:p-6"
    >
      <div className="flex max-w-xl flex-col gap-1">
        <h3 id="contribute-unlock-title" className="text-h3 text-brand-950">
          Contribute your adaptation story
        </h3>
        <p className="text-body text-pretty text-brand-800">
          Share one structured STAR experience from your semester to earn a Verified Contributor badge and help incoming students settle in faster.
        </p>
      </div>

      <ButtonLink
        href="/knowledge/share-experience"
        variant="outline"
        className="shrink-0 self-start sm:self-auto"
      >
        <span>Share experience</span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </ButtonLink>
    </aside>
  );
}
