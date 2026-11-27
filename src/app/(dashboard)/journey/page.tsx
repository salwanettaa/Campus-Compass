import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { ButtonLink } from "@/components/ui/button";
import { JourneyWorkspace } from "@/components/journey/journey-workspace";
import { normalizeAdaptationProfile } from "@/lib/constants/onboarding";
import { getUserJourneyData } from "@/lib/journey/data";
import { listGuides } from "@/lib/knowledge/data";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "My Journey" };

export default async function JourneyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("adaptation_area, main_challenge")
    .eq("id", user?.id ?? "")
    .maybeSingle();

  if (profileError) {
    return (
      <main className="flex flex-col items-start gap-3">
        <Alert variant="error" title="We could not load your journey">
          Something went wrong on our side. Please try again.
        </Alert>
        <ButtonLink href="/journey" variant="outline" size="sm">
          Try again
        </ButtonLink>
      </main>
    );
  }

  const normalized = normalizeAdaptationProfile(
    profile?.adaptation_area,
    profile?.main_challenge,
  );

  const [journeyRes, guidesRes] = await Promise.all([
    getUserJourneyData(normalized.area, normalized.challenge),
    listGuides(),
  ]);

  const allGuides = guidesRes.ok ? guidesRes.data : [];
  const areaGuides = allGuides
    .filter(
      (guide) =>
        guide.category === journeyRes.journey.definition.guideCategory,
    )
    .slice(0, 4);

  return (
    <main className="flex w-full flex-col gap-8">
      {journeyRes.error ? (
        <Alert variant="error">{journeyRes.error}</Alert>
      ) : null}
      <JourneyWorkspace
        journey={journeyRes.journey}
        recommendedGuides={areaGuides}
        schemaReady={journeyRes.schemaReady}
      />
    </main>
  );
}
