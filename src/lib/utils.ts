import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * Our typography utilities (text-h1 ... text-caption, see globals.css) set
 * font-size, line-height and weight. Without this, tailwind-merge mistakes them
 * for text *colors* and drops e.g. `text-white` when both are present.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "body",
            "caption",
          ],
        },
      ],
    },
  },
});

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
