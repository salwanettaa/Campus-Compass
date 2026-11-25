export default function AiNavigatorLoading() {
  return (
    <div role="status" aria-live="polite" className="flex animate-pulse flex-col gap-4">
      <div className="h-24 border-b border-brand-300" />
      <div className="h-64 rounded-md border border-brand-300 bg-white/70" />
      <span className="sr-only">Loading AI Navigator</span>
    </div>
  );
}
