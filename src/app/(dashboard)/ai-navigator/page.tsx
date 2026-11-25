import type { Metadata } from "next";
import { SampleChat } from "@/components/ai-navigator/sample-chat";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "AI Navigator" };

export default function AiNavigatorPage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 border-b border-brand-950/15 pb-5">
        <p className="font-mono text-[10px] tracking-[0.16em] text-brand-700">
          GROUNDED GUIDANCE / 03
        </p>
        <h1 className="text-4xl leading-tight font-semibold tracking-[-0.05em] text-brand-950">
          AI Navigator
        </h1>
        <p className="text-body max-w-xl text-brand-800">
          A future way to connect campus questions to reliable sources and next
          steps.
        </p>
      </header>

      <Alert variant="info" title="Coming soon">
        This page shows a sample of how answers and source cards will look. The
        conversation below is fake and no AI is connected yet.
      </Alert>

      <SampleChat />
    </main>
  );
}
