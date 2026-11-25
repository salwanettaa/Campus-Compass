export default function KnowledgeLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Knowledge Hub"
      className="flex animate-pulse flex-col gap-4"
    >
      <div className="h-16 border-b border-brand-950/15 bg-brand-100/50" />
      <div className="h-12 rounded-lg bg-paper-raised" />
      <div className="flex gap-2 overflow-hidden">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-11 w-32 shrink-0 rounded-lg bg-paper-raised" />
        ))}
      </div>
      <div className="h-40 border border-brand-950/10 bg-paper-raised/80" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
