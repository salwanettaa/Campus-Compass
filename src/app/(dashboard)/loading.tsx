export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="flex animate-pulse flex-col gap-6"
    >
      <div className="h-24 border-b border-brand-950/15 bg-brand-100/50" />
      <div className="h-32 border-b border-brand-950/10 bg-paper-raised/70" />
      <div className="h-32 border border-brand-950/10 bg-paper-raised/70" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
