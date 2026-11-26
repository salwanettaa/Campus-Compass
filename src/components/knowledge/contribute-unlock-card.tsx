import Link from "next/link";
import { ArrowRight, Award, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export function ContributeUnlockCard() {
  return (
    <aside
      aria-labelledby="contribute-unlock-title"
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 rounded-2xl border border-brand-300 bg-card-tint p-5 sm:p-6 shadow-xs"
    >
      <div className="flex items-start gap-3.5 max-w-xl">
        <div className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-900 border border-brand-200">
          <Award className="size-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h3 id="contribute-unlock-title" className="text-h5 font-semibold text-brand-950">
              Contribute to Unlock: Bantu Mahasiswa Lain Beradaptasi
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2 py-0.5 text-xs font-semibold text-amber-900">
              <Sparkles className="size-3" aria-hidden="true" />
              +50 Karma
            </span>
          </div>
          <p className="text-caption text-pretty text-brand-800">
            Bagikan 1 cerita adaptasimu menggunakan format terstruktur STAR. Kontribusimu akan membuka lencana <strong>Verified Contributor</strong> dan membantu adik tingkat melewati masa transisi kuliah.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
        <ButtonLink
          href="/knowledge/share-experience"
          variant="primary"
          className="inline-flex items-center gap-1.5"
        >
          <span>Bagikan Pengalaman</span>
          <ArrowRight className="size-4" aria-hidden="true" />
        </ButtonLink>
      </div>
    </aside>
  );
}
