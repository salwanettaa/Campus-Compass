import type { Metadata } from "next";
import { SampleChat } from "@/components/ai-navigator/sample-chat";
import { Alert } from "@/components/ui/alert";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "AI Navigator" };

type SearchParams = Record<string, string | string[] | undefined>;

export default async function AiNavigatorPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const raw = await searchParams;
  const query = Array.isArray(raw.q) ? raw.q[0] : raw.q;
  const initialQuery = query?.trim().slice(0, 200);

  return (
    <main className="flex w-full flex-col gap-6">
      <PageHeader
        title="AI Navigator"
        description="Preview of source-grounded campus answers with Knowledge Hub citations."
      />

      <Alert variant="info" title="Preview mode (not live AI yet)">
        Pick a sample question below to inspect how answers cite verified campus
        guides or redirect to Community when evidence is missing. Live Gemini
        API retrieval is scheduled for the next milestone.
      </Alert>

      <SampleChat initialQuery={initialQuery} />
    </main>
  );
}
