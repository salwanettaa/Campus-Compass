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
const RADIUS = 39;
const TICKS = Array.from({ length: 36 }, (_, index) => index * 10);

/**
 * "Where are you stuck?" The six guide categories sit around a compass dial.
 * Native radios give arrow-key support; the needle turns to the chosen point.
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
    <div className="liquid-glass-dark mx-auto w-full max-w-md rounded-[2rem] p-4">
      <fieldset>
        <legend className="mx-auto text-center text-base font-semibold text-white">
          Where are you stuck?
        </legend>
        <div className="relative mx-auto mt-1 aspect-square w-full max-w-[18rem]">
          <svg
            aria-hidden="true"
            viewBox="0 0 200 200"
            className="absolute inset-0 size-full"
            fill="none"
          >
            <circle cx="100" cy="100" r="54" stroke="white" strokeOpacity="0.3" />
            <circle cx="100" cy="100" r="40" stroke="white" strokeOpacity="0.15" />
            {TICKS.map((tick) => (
              <line
                key={tick}
                x1="100"
                x2="100"
                y1="46"
                y2={tick % STEP === 0 ? 55 : 50}
                stroke="white"
                strokeOpacity={tick % STEP === 0 ? 0.75 : 0.3}
                transform={`rotate(${tick} 100 100)`}
              />
            ))}
            <g
              className="origin-center transition-transform duration-700 ease-[cubic-bezier(0.34,1.45,0.5,1)]"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <path d="M100 54 110 100H90Z" fill="var(--color-route-on-dark)" />
              <path d="M100 146 90 100h20Z" fill="white" fillOpacity="0.55" />
            </g>
            <circle cx="100" cy="100" r="7" fill="white" />
            <circle cx="100" cy="100" r="2.5" fill="var(--color-brand-950)" />
          </svg>

          {points.map((entry, index) => {
            const radians = (index * STEP * Math.PI) / 180;
            return (
              <label
                key={entry.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  left: `${(50 + RADIUS * Math.sin(radians)).toFixed(2)}%`,
                  top: `${(50 - RADIUS * Math.cos(radians)).toFixed(2)}%`,
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
                    "flex min-h-11 items-center rounded-full border px-3 text-xs font-medium whitespace-nowrap transition-colors duration-200",
                    "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-white",
                    index === selected
                      ? "border-white bg-white font-semibold text-brand-950"
                      : "border-white/40 bg-brand-950/60 text-white hover:border-white hover:bg-brand-900",
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
        className="mt-2 min-h-[8.5rem] rounded-[1.25rem] bg-white p-4 text-brand-950"
      >
        <p className="text-caption font-medium text-brand-800">
          {point.category} · sample guide
        </p>
        <p className="text-h5 mt-1 font-semibold">{point.guideTitle}</p>
        <p className="text-caption mt-1 line-clamp-2 text-brand-900">{point.guideLine}</p>
      </div>
    </div>
  );
}
