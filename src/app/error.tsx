"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaces in the browser console and in Vercel logs via the digest.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-10">
      <main
        role="alert"
        className="flex flex-col items-start gap-4 border-t border-red-700 pt-6"
      >
        <h1 className="text-h1 text-brand-950">Something went wrong</h1>
        <p className="text-lead text-brand-800">
          An unexpected error happened on our side. Please try again.
        </p>
        {error.digest ? (
          <p className="text-caption text-brand-800">Reference: {error.digest}</p>
        ) : null}
        <Button onClick={reset}>Try again</Button>
      </main>
    </div>
  );
}
