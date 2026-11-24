export default function CommunityLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading community"
      className="flex animate-pulse flex-col gap-4"
    >
      <div className="h-10 w-48 rounded-xl bg-brand-300/50" />
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-24 rounded-full bg-brand-300/50" />
        ))}
      </div>
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-44 rounded-3xl bg-white/80" />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
}
