export default function KnowledgeLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Knowledge Hub"
      className="flex animate-pulse flex-col gap-4"
    >
      <div className="h-10 w-56 rounded-xl bg-brand-300/50" />
      <div className="h-12 rounded-full bg-white/80" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-28 rounded-3xl bg-white/80" />
        ))}
      </div>
      <div className="h-40 rounded-3xl bg-white/80" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
