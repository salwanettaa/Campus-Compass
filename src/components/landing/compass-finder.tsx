"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type CompassPoint = {
  id: string;
  /** Short name shown on the dial */
  short: string;
  category: string;
  description: string;
  guideTitle: string;
  guideLine: string;
};

const STEP = 60;
const LABEL_RADIUS = 40;
const TICKS = Array.from({ length: 120 }, (_, index) => index * 3);

/**
 * "Where are you stuck?" The six guide categories sit around a compass dial.
 * Native radios give arrow-key support; the needle turns to the chosen point.
 * A mouse can also preview a point by hovering it.
 */
export function CompassFinder({ points }: { points: readonly CompassPoint[] }) {
  const [{ selected, angle }, setState] = useState({ selected: 0, angle: 0 });
  const point = points[selected];

  function choose(index: number) {
    setState((current) => {
      // Turn the short way round instead of unwinding the whole dial.
      const delta = ((index * STEP - current.angle) % 360 + 540) % 360 - 180;
      return { selected: index, angle: current.angle + delta };
    });
  }

  return (
    <div className="mx-auto w-full max-w-[36rem]">
      <fieldset>
        <legend className="text-h4 mx-auto text-center text-brand-950">
          Where are you stuck?
        </legend>
        <div className="relative mx-auto mt-3 aspect-square w-full">
          <div aria-hidden="true" className="compass-glow absolute inset-0" />
          <svg
            aria-hidden="true"
            viewBox="0 0 400 400"
            className="absolute inset-0 size-full"
            fill="none"
          >
            {TICKS.map((tick) => (
              <line
                key={tick}
                x1="200"
                x2="200"
                y1="6"
                y2={tick % STEP === 0 ? 22 : 13}
                stroke="var(--color-brand-700)"
                strokeOpacity={tick % STEP === 0 ? 0.9 : 0.3}
                transform={`rotate(${tick} 200 200)`}
              />
            ))}
            <circle cx="200" cy="200" r="160" stroke="var(--color-brand-600)" strokeWidth="1.5" />
            <circle cx="200" cy="200" r="112" stroke="var(--color-brand-700)" strokeOpacity="0.28" />
            <circle cx="200" cy="200" r="62" stroke="var(--color-brand-700)" strokeOpacity="0.16" />
            <path d="M200 88v224M88 200h224" stroke="var(--color-brand-700)" strokeOpacity="0.14" />
            <g
              className="transition-transform duration-700 ease-[cubic-bezier(0.34,1.45,0.5,1)]"
              style={{ transform: `rotate(${angle}deg)`, transformOrigin: "200px 200px" }}
            >
              <path d="M200 66 217 200h-34Z" fill="var(--color-route)" />
              <path d="M200 334 183 200h34Z" fill="var(--color-brand-700)" fillOpacity="0.45" />
            </g>
            <circle cx="200" cy="200" r="17" fill="var(--color-brand-950)" />
            <circle cx="200" cy="200" r="6" fill="var(--color-paper)" />
          </svg>

          {points.map((entry, index) => {
            const radians = (index * STEP * Math.PI) / 180;
            return (
              <label
                key={entry.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${(50 + LABEL_RADIUS * Math.sin(radians)).toFixed(2)}%`,
                  top: `${(50 - LABEL_RADIUS * Math.cos(radians)).toFixed(2)}%`,
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") choose(index);
                }}
              >
                <input
                  type="radio"
                  name="compass-point"
                  value={entry.id}
                  checked={index === selected}
                  onChange={() => choose(index)}
                  className="peer sr-only"
                />
                <span
                  className={cn(
                    "flex min-h-11 items-center rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors duration-200 sm:px-5 sm:text-sm",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-700",
                    index === selected
                      ? "border-frost bg-frost font-semibold text-ink"
                      : "border-brand-400 bg-paper text-brand-950 hover:border-brand-700 active:bg-brand-100",
                  )}
                >
                  {entry.short}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div
        aria-live="polite"
        className="relative mt-4 min-h-[8.5rem] rounded-3xl bg-paper-raised p-5 text-center"
      >
        <p className="text-caption text-brand-700">
          {point.category} · sample guide
        </p>
        <p className="text-h3 mt-1 text-brand-950">{point.guideTitle}</p>
        <p className="text-body mt-1 line-clamp-2 text-brand-800">{point.guideLine}</p>
      </div>
    </div>
  );
}
