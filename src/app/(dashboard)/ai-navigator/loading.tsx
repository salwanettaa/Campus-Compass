export default function AiNavigatorLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading AI Navigator"
      className="flex animate-pulse flex-col gap-4"
    >
      <div className="h-16 border-b border-brand-950/15 bg-brand-100/50" />
      <div className="h-64 border border-brand-950/10 bg-paper-raised/80" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
