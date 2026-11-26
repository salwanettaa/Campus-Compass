import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const iconButtonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center rounded-xl",
    "transition-[background-color,box-shadow,transform,color] duration-200",
    "active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        /** Active / selected state */
        solid:
          "bg-fill text-white hover:brightness-110",
        /** Default state */
        outline:
          "border border-brand-950/15 bg-paper-raised text-brand-800 hover:border-brand-600 hover:bg-brand-100",
      },
      size: {
        md: "size-11 [&>svg]:size-5",
        lg: "size-12 [&>svg]:size-6",
      },
    },
    defaultVariants: { variant: "outline", size: "lg" },
  },
);

export type IconButtonProps = Omit<ComponentProps<"button">, "aria-label"> &
  VariantProps<typeof iconButtonVariants> & {
    /** Required: an icon-only button has no visible text for screen readers. */
    "aria-label": string;
  };

export function IconButton({
  className,
  variant,
  size,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(iconButtonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
