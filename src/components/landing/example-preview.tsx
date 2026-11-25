"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export type PreviewItem = {
  /** Tab label */
  label: string;
  title: string;
  body: string;
  replyLabel: string;
  reply: string;
  note: string;
};

/** Tabbed look at the three kinds of campus knowledge, using sample content. */
export function ExamplePreview({ items }: { items: readonly PreviewItem[] }) {
  const [selected, setSelected] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const id = useId();
  const item = items[selected];

  function handleKey(event: KeyboardEvent) {
    const moves: Record<string, number> = {
      ArrowRight: (selected + 1) % items.length,
      ArrowLeft: (selected - 1 + items.length) % items.length,
      Home: 0,
      End: items.length - 1,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus();
  }

  return (
    <div className="liquid-glass rounded-[1.5rem]">
      <div
        role="tablist"
        aria-label="Examples of campus knowledge"
        className="grid grid-cols-3 gap-1 border-b border-brand-300 p-2"
      >
        {items.map((entry, index) => (
          <button
            key={entry.label}
            ref={(node) => {
              tabs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={index === selected}
            aria-controls={`${id}-panel`}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            onKeyDown={handleKey}
            className={cn(
              "text-h5 min-h-11 rounded-full px-2 transition-colors duration-150",
              index === selected
                ? "bg-brand-900 text-white"
                : "text-brand-900 hover:bg-brand-100",
            )}
          >
            {entry.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-tab-${selected}`}
        tabIndex={0}
        className="flex flex-col gap-4 p-5 sm:min-h-[25rem] sm:p-7"
      >
        <p className="font-mono text-xs text-brand-800">Sample content</p>
        <h2 className="text-h2 text-brand-950">{item.title}</h2>
        <p className="text-body text-brand-900">{item.body}</p>
        <div className="mt-1 rounded-md bg-brand-100 p-4">
          <p className="text-h5 text-brand-950">{item.replyLabel}</p>
          <p className="text-body mt-1 text-brand-900">{item.reply}</p>
        </div>
        <p className="text-caption mt-auto border-t border-brand-300 pt-3 text-brand-800">
          {item.note}
        </p>
      </div>
    </div>
  );
}
