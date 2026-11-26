export default function KnowledgeLoading() {
  return (
    <div role="status" aria-live="polite" className="flex animate-pulse flex-col gap-4">
      <div className="h-24 border-b border-brand-300" />
      <div className="h-12 rounded-full bg-brand-100" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-32 rounded-md border border-brand-300 bg-paper-raised" />
      ))}
      <span className="sr-only">Loading guides and experiences</span>
    </div>
  );
}
