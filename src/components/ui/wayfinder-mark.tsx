export function WayfinderMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      focusable="false"
    >
      <path
        d="m4.5 8 7-3 9 3 7-3v22l-7 3-9-3-7 3V8Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M11.5 5v22m9-19v22"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="m8 19 5-5 4 2.5 7-7m-4 0 4.5-.5-.5 4.5"
        stroke="#d46747"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <circle cx="8" cy="19" r="1.5" fill="#d46747" />
    </svg>
  );
}
