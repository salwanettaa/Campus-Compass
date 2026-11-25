import type { Metadata } from "next";
import { SampleChat } from "@/components/ai-navigator/sample-chat";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "AI Navigator" };

export default function AiNavigatorPage() {
  return (
    <main className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="AI Navigator"
        description="A future way to connect campus questions to reliable sources and next steps."
      />

      <Alert variant="info" title="Coming soon">
        This page shows a sample of how answers and source cards will look. The
        conversation below is fake and no AI is connected yet.
      </Alert>

      <SampleChat />
    </main>
  );
}
