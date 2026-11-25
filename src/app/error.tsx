"use client";

import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
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
        className="flex flex-col items-start gap-4 border border-brand-950/10 border-l-4 border-l-red-700 bg-paper-raised p-6 sm:p-8"
      >
        <span className="flex size-11 items-center justify-center border border-red-900/10 bg-red-50 text-red-700">
          <TriangleAlert className="size-6" aria-hidden="true" />
        </span>
        <h1 className="text-h2 text-brand-950">Something went wrong</h1>
        <p className="text-body text-brand-800">
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
