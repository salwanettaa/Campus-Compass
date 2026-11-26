export default function CommunityLoading() {
  return (
    <div role="status" aria-live="polite" className="flex animate-pulse flex-col gap-4">
      <div className="h-24 border-b border-brand-300" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-40 rounded-md border border-brand-300 bg-paper-raised" />
      ))}
      <span className="sr-only">Loading community posts</span>
    </div>
  );
}
