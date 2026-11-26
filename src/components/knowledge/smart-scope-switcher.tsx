"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Select } from "@/components/ui/select";
import {
  buildKnowledgeQuery,
  type KnowledgeParams,
} from "@/lib/knowledge/filter";
import {
  AVAILABLE_PROGRAMS,
  PILOT_PROGRAM,
  type ProgramOption,
} from "@/lib/knowledge/types";
import { cn } from "@/lib/utils";

interface SmartScopeSwitcherProps {
  params: KnowledgeParams;
  campusName?: string;
  myProgram?: ProgramOption;
  programs?: readonly ProgramOption[];
}

/**
 * Campus and program scope filter.
 * Dynamically renders the signed-in student's campus, primary program,
 * and other programs under that campus.
 */
export function SmartScopeSwitcher({
  params,
  campusName = "Universitas Gadjah Mada",
  myProgram = PILOT_PROGRAM,
  programs = AVAILABLE_PROGRAMS,
}: SmartScopeSwitcherProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const currentScope = params.scope ?? "major";

  const isMajorActive =
    currentScope === "major" || currentScope === myProgram.id;
  const isAllActive = currentScope === "all";

  const otherPrograms = programs.filter((p) => p.id !== myProgram.id);
  const selectedOtherProgram = otherPrograms.find(
    (p) => p.id === currentScope,
  );

  function handleProgramSelect(value: string) {
    if (!value) return;
    startTransition(() => {
      router.push(
        `/knowledge${buildKnowledgeQuery({ ...params, scope: value })}`,
        { scroll: false },
      );
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        pending && "opacity-75",
      )}
      aria-busy={pending || undefined}
    >
      <div className="flex flex-col gap-2">
        <p className="text-caption text-brand-800">
          {campusName} ·{" "}
          {selectedOtherProgram
            ? `Browsing ${selectedOtherProgram.name}`
            : isAllActive
              ? "General guides across all programs"
              : `${myProgram.name} (${myProgram.faculty})`}
        </p>

        <nav aria-label="Scope filter" className="flex flex-wrap gap-2">
          <Link
            href={`/knowledge${buildKnowledgeQuery({ ...params, scope: "major" })}`}
            aria-current={isMajorActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-4 text-body transition-colors duration-150",
              isMajorActive
                ? "border-brand-700 bg-brand-700 font-semibold text-white"
                : "border-brand-300 bg-white text-brand-900 hover:border-brand-700 active:bg-brand-100",
            )}
          >
            {myProgram.shortName}
          </Link>

          <Link
            href={`/knowledge${buildKnowledgeQuery({ ...params, scope: "all" })}`}
            aria-current={isAllActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-4 text-body transition-colors duration-150",
              isAllActive
                ? "border-brand-700 bg-brand-700 font-semibold text-white"
                : "border-brand-300 bg-white text-brand-900 hover:border-brand-700 active:bg-brand-100",
            )}
          >
            General (All programs)
          </Link>
        </nav>
      </div>

      {otherPrograms.length > 0 ? (
        <div className="w-full sm:w-64">
          <label
            htmlFor="other-programs-select"
            className="text-caption mb-1 block text-brand-800"
          >
            Browse another program
          </label>
          <Select
            id="other-programs-select"
            value={selectedOtherProgram ? currentScope : ""}
            onChange={(e) => handleProgramSelect(e.target.value)}
            className="h-11 text-body"
          >
            <option value="" disabled>
              Choose a program...
            </option>
            {otherPrograms.map((prog: ProgramOption) => (
              <option key={prog.id} value={prog.id}>
                {prog.shortName}
              </option>
            ))}
          </Select>
        </div>
      ) : null}
    </div>
  );
}
