export default function AiNavigatorLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading AI Navigator"
      className="flex animate-pulse flex-col gap-4"
    >
      <div className="h-10 w-56 rounded-xl bg-brand-300/50" />
      <div className="h-64 rounded-3xl bg-white/80" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
