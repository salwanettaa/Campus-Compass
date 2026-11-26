"use client";

import { useRouter } from "next/navigation";
import { Compass, GraduationCap, School } from "lucide-react";
import {
  AVAILABLE_PROGRAMS,
  PILOT_PROGRAM,
  type ProgramOption,
} from "@/lib/knowledge/types";
import {
  buildKnowledgeQuery,
  type KnowledgeParams,
} from "@/lib/knowledge/filter";
import { cn } from "@/lib/utils";

interface SmartScopeSwitcherProps {
  params: KnowledgeParams;
  campusName?: string;
}

export function SmartScopeSwitcher({
  params,
  campusName = "Universitas Gadjah Mada (UGM)",
}: SmartScopeSwitcherProps) {
  const router = useRouter();
  const currentScope = params.scope ?? "major";

  const handleScopeChange = (newScope: string) => {
    const nextParams = { ...params, scope: newScope };
    router.push(`/knowledge${buildKnowledgeQuery(nextParams)}`);
  };

  const otherPrograms = AVAILABLE_PROGRAMS.filter(
    (p) => p.id !== PILOT_PROGRAM.id,
  );
  const isCustomProgramSelected =
    currentScope !== "all" &&
    currentScope !== "major" &&
    currentScope !== PILOT_PROGRAM.id;

  const selectedOtherProgram = otherPrograms.find(
    (p) => p.id === currentScope,
  );

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-brand-300 bg-paper-raised p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-brand-200 pb-3">
        <div className="flex items-center gap-2 text-caption font-medium text-brand-800">
          <School className="size-4 text-brand-700" aria-hidden="true" />
          <span>Kampus Utama:</span>
          <span className="font-semibold text-brand-950">{campusName}</span>
        </div>
        <div className="text-caption text-brand-700">
          {currentScope === "all" ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-brand-900">
              <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
              Menampilkan panduan universal seluruh mahasiswa UGM
            </span>
          ) : currentScope === "major" || currentScope === PILOT_PROGRAM.id ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-brand-900">
              <span className="size-2 rounded-full bg-brand-700" />
              Fokus: {PILOT_PROGRAM.name} ({PILOT_PROGRAM.faculty})
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 font-medium text-brand-900">
              <span className="size-2 rounded-full bg-amber-600" />
              Mode Eksplorasi: {selectedOtherProgram?.name ?? currentScope}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
        <div
          role="tablist"
          aria-label="Filter Lingkup Kampus"
          className="inline-flex flex-wrap items-center gap-2 p-1 rounded-xl bg-card-tint border border-brand-200"
        >
          {/* Option 1: Major Saya (Default - Pilot D4 TRI) */}
          <button
            type="button"
            role="tab"
            aria-selected={currentScope === "major" || currentScope === PILOT_PROGRAM.id}
            onClick={() => handleScopeChange("major")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-body font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none",
              currentScope === "major" || currentScope === PILOT_PROGRAM.id
                ? "bg-brand-700 text-white shadow-xs font-semibold"
                : "text-brand-900 hover:text-brand-950 hover:bg-brand-100",
            )}
          >
            <GraduationCap className="size-4 shrink-0" aria-hidden="true" />
            <span>Jurusan Saya: {PILOT_PROGRAM.shortName}</span>
          </button>

          {/* Option 2: General / Semua UGM */}
          <button
            type="button"
            role="tab"
            aria-selected={currentScope === "all"}
            onClick={() => handleScopeChange("all")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-body font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none",
              currentScope === "all"
                ? "bg-brand-700 text-white shadow-xs font-semibold"
                : "text-brand-900 hover:text-brand-950 hover:bg-brand-100",
            )}
          >
            <Compass className="size-4 shrink-0" aria-hidden="true" />
            <span>Semua UGM (General)</span>
          </button>
        </div>

        {/* Option 3: Dropdown Jelajahi Jurusan Lain */}
        <div className="flex items-center gap-2">
          <label htmlFor="other-programs-select" className="sr-only">
            Jelajahi Jurusan Lain
          </label>
          <div className="relative min-w-[220px]">
            <select
              id="other-programs-select"
              aria-label="Pilih jurusan lain untuk dijelajahi"
              value={isCustomProgramSelected ? currentScope : ""}
              onChange={(e) => {
                if (e.target.value) {
                  handleScopeChange(e.target.value);
                }
              }}
              className={cn(
                "h-10 w-full appearance-none rounded-lg border px-3 pr-8 text-caption font-medium transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none cursor-pointer",
                isCustomProgramSelected
                  ? "border-brand-700 bg-brand-700 text-white font-semibold"
                  : "border-brand-300 bg-white text-brand-900 hover:border-brand-500",
              )}
            >
              <option value="" disabled className="text-brand-700 bg-white">
                ▾ Jelajahi Jurusan Lain...
              </option>
              {otherPrograms.map((prog: ProgramOption) => (
                <option
                  key={prog.id}
                  value={prog.id}
                  className="text-brand-950 bg-white py-1"
                >
                  {prog.name} ({prog.faculty})
                </option>
              ))}
            </select>
            <div
              className={cn(
                "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs",
                isCustomProgramSelected ? "text-white" : "text-brand-700",
              )}
            >
              ▼
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
