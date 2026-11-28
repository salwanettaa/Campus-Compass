import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "press inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-semibold whitespace-nowrap select-none",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        /** Main action. Use one per view. */
        primary: "bg-fill text-white hover:bg-[#075985] active:bg-[#0c4a6e]",
        /** Secondary action */
        outline:
          "border border-brand-400 bg-paper-raised text-brand-950 hover:border-brand-600 hover:bg-frost active:bg-brand-100",
        ghost: "text-brand-900 hover:bg-brand-100 active:bg-brand-300",
      },
      size: {
        sm: "h-11 px-4 text-h5",
        md: "h-11 px-5 text-h5",
        lg: "h-12 px-6 text-h4",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

export type ButtonProps = ComponentProps<"button"> &
  ButtonVariantProps & {
    /** Shows a spinner and blocks interaction while an action is running. */
    loading?: boolean;
  };

export function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
}

export type ButtonLinkProps = ComponentProps<typeof Link> & ButtonVariantProps;

/** A `next/link` that looks like a Button. */
export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
