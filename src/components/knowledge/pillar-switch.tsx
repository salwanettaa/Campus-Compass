import Link from "next/link";
import {
  buildKnowledgeQuery,
  type KnowledgeParams,
} from "@/lib/knowledge/filter";
import { cn } from "@/lib/utils";

interface PillarSwitchProps {
  params: KnowledgeParams;
  guidesCount: number;
  experiencesCount: number;
}

/** Plain-link section switcher between Curated Guides and Senior Experiences. */
export function PillarSwitch({
  params,
  guidesCount,
  experiencesCount,
}: PillarSwitchProps) {
  const currentPillar = params.pillar ?? "guides";

  const items = [
    {
      id: "guides" as const,
      label: "Curated guides",
      count: guidesCount,
    },
    {
      id: "experiences" as const,
      label: "Senior experiences",
      count: experiencesCount,
    },
  ];

  return (
    <nav
      aria-label="Content type"
      className="flex gap-6 border-b border-brand-300"
    >
      {items.map((item) => {
        const active = currentPillar === item.id;
        return (
          <Link
            key={item.id}
            href={`/knowledge${buildKnowledgeQuery({ ...params, pillar: item.id })}`}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px inline-flex min-h-11 items-center gap-2 border-b-2 px-1 text-h5 transition-colors duration-150",
              active
                ? "border-brand-900 font-semibold text-brand-950"
                : "border-transparent text-brand-800 hover:border-brand-400 hover:text-brand-950",
            )}
          >
            <span>{item.label}</span>
            <span
              className={cn(
                "font-mono text-xs tabular-nums",
                active ? "text-brand-950" : "text-brand-800",
              )}
            >
              {item.count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
