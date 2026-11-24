export default function DashboardLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="flex animate-pulse flex-col gap-6"
    >
      <div className="h-40 rounded-3xl bg-brand-300/50" />
      <div className="h-32 rounded-3xl bg-white/80" />
      <div className="h-32 rounded-3xl bg-white/80" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
