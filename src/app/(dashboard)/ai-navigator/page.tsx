import type { Metadata } from "next";
import { SampleChat } from "@/components/ai-navigator/sample-chat";
import { Alert } from "@/components/ui/alert";

export const metadata: Metadata = { title: "AI Navigator" };

export default function AiNavigatorPage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-h1 text-brand-950">AI Navigator</h1>
        <p className="text-body text-brand-800">
          Ask a question and get an answer with the sources it came from.
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
