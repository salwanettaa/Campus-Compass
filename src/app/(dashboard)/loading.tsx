export default function DashboardLoading() {
  return (
    <div role="status" aria-live="polite" className="flex animate-pulse flex-col gap-6">
      <div className="h-24 border-b border-brand-300" />
      <div className="h-40 rounded-md bg-brand-100/60" />
      <div className="h-40 rounded-md bg-brand-100/60" />
      <span className="sr-only">Loading your page</span>
    </div>
  );
}
