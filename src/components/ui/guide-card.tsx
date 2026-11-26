import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { WayfinderMark } from "@/components/ui/wayfinder-mark";

export type GuideCardProps = {
  title: string;
  href: string;
  /** Optional cover image. A branded placeholder is shown when omitted. */
  imageSrc?: string;
  imageAlt?: string;
  /** "tinted" = light-blue card, "plain" = white card (both from the reference). */
  variant?: "tinted" | "plain";
  actionLabel?: string;
  className?: string;
};

export function GuideCard({
  title,
  href,
  imageSrc,
  imageAlt = "",
  variant = "plain",
  actionLabel = "Explore",
  className,
}: GuideCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border border-brand-950/10 p-3",
        "transition-colors duration-200 hover:bg-brand-100",
        variant === "tinted" ? "bg-brand-100" : "bg-paper-raised",
        className,
      )}
    >
      <div className="relative aspect-4/3 overflow-hidden bg-ink">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 320px, 100vw"
            className="object-cover"
          />
        ) : (
          <WayfinderMark
            className="absolute inset-0 m-auto size-10 text-brand-300"
          />
        )}
      </div>
      <div className="flex flex-col gap-1 px-1 pb-1">
        <h3 className="text-h5 text-brand-950">{title}</h3>
        <span className="inline-flex items-center gap-1 text-h5 text-brand-800">
          {actionLabel}
          <ArrowRight
            className="size-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
