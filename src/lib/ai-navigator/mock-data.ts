/**
 * SAMPLE DATA ONLY. This is a fake conversation to show the future AI Navigator
 * layout. No AI model, retrieval, or real campus rule is involved.
 */
import { MOCK_GUIDES } from "@/lib/knowledge/mock-data";

export type SourceCard = {
  /** Number used in the answer as [1], [2], ... */
  index: number;
  title: string;
  /** Matches `guides.source_type`. */
  sourceType: string;
  lastVerifiedAt: string;
  /** Guide in the Knowledge Hub that this source points to. */
  guideId: string;
};

export type SampleMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; text: string; citations: number[] };

const registration = MOCK_GUIDES[3];
const planning = MOCK_GUIDES[0];

export const SAMPLE_SOURCES: SourceCard[] = [
  {
    index: 1,
    title: registration.title,
    sourceType: registration.source_type,
    lastVerifiedAt: registration.last_verified_at,
    guideId: registration.id,
  },
  {
    index: 2,
    title: planning.title,
    sourceType: planning.source_type,
    lastVerifiedAt: planning.last_verified_at,
    guideId: planning.id,
  },
];

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: "m1",
    role: "user",
    text: "Two of my courses clash this semester. What should I do?",
  },
  {
    id: "m2",
    role: "assistant",
    text: "Check your study plan first and talk to your academic advisor about the clash [2]. If the portal shows an error during registration, contact the faculty office within the registration period [1].",
    citations: [1, 2],
  },
];

/** The citation numbers used in a message text, e.g. "[2] ... [1]" gives [2, 1]. */
export function citationNumbers(text: string): number[] {
  return [...text.matchAll(/\[(\d+)\]/g)].map((match) => Number(match[1]));
}
