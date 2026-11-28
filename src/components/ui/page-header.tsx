import type { ReactNode } from "react";

/** Shared page title block: heading, one line of context, optional action. */
export function PageHeader({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-brand-300 pb-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
      <div className="flex min-w-0 flex-col gap-2">
        <h1 className="text-h1 break-words text-brand-950">{title}</h1>
        {description ? (
          <p className="text-lead max-w-2xl text-brand-800">{description}</p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </header>
  );
}
