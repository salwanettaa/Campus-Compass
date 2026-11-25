import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const STYLES = {
  info: {
    box: "border-brand-700 bg-white/70 text-brand-950",
    icon: Info,
    tone: "text-brand-800",
  },
  success: {
    box: "border-emerald-700 bg-white/70 text-emerald-950",
    icon: CheckCircle2,
    tone: "text-emerald-700",
  },
  error: {
    box: "border-red-700 bg-white/70 text-red-950",
    icon: AlertCircle,
    tone: "text-red-700",
  },
} as const;

export type AlertProps = {
  variant?: keyof typeof STYLES;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Alert({ variant = "info", title, children, className }: AlertProps) {
  const style = STYLES[variant];
  const Icon = style.icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn("flex gap-3 border-l-4 p-4", style.box, className)}
    >
      <Icon className={cn("mt-0.5 size-5 shrink-0", style.tone)} aria-hidden="true" />
      <div className="flex flex-col gap-0.5">
        {title ? <p className="text-h5">{title}</p> : null}
        <div className="text-body">{children}</div>
      </div>
    </div>
  );
}
