/**
 * The Campus Compass mark: a C with an opening, and a compass needle that
 * leaves through it. Drawn on a 32px grid so it stays legible at 16px.
 * The ring follows the text colour; the needle is always the route orange.
 */
export function LogoMark({
  className,
  needle = "#ea580c",
}: {
  className?: string;
  needle?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className={className}
      viewBox="0 0 32 32"
      fill="none"
    >
      <path
        d="M15.04 5.04A11 11 0 1 0 26.96 16.96"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="5"
      />
      <path
        d="M28.4 3.6 19 19l-6.8.8.8-6.8Z"
        fill={needle}
        stroke={needle}
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}
