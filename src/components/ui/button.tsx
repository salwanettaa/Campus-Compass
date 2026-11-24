import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap select-none",
    "transition-[background-color,box-shadow,transform,color] duration-200",
    "active:scale-[0.98]",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        /** "Get Started" - main call to action */
        primary:
          "bg-linear-to-br from-brand-800 to-brand-600 text-white shadow-card hover:from-brand-900 hover:to-brand-800",
        /** "Learn More" - secondary call to action */
        outline:
          "border-2 border-brand-600 bg-white text-brand-900 hover:bg-brand-100",
        /** Sign Up pill on the dark navbar */
        pillOnDark: "bg-white text-brand-900 hover:bg-brand-100",
        /** Sign Up pill on the light navbar */
        pillOnLight: "bg-brand-900 text-white hover:bg-brand-950",
        ghost: "text-brand-800 hover:bg-brand-100",
      },
      size: {
        sm: "h-9 px-5 text-h5",
        md: "h-11 px-6 text-h4",
        lg: "h-14 px-8 text-h4 font-semibold",
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
