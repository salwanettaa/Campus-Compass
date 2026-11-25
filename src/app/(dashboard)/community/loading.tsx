export default function CommunityLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading community"
      className="flex animate-pulse flex-col gap-4"
    >
      <div className="h-16 border-b border-brand-950/15 bg-brand-100/50" />
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-11 w-24 rounded-lg bg-paper-raised" />
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-44 border border-brand-950/10 border-l-2 border-l-brand-300 bg-paper-raised/80" />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
