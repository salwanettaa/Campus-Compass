/**
 * SAMPLE DATA ONLY. Pre-authored demo scenarios to preview how AI Navigator
 * grounds answers in campus guides and handles missing evidence. No live AI
 * model or vector retrieval is connected in this preview.
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

export type SampleScenario = {
  id: string;
  label: string;
  messages: SampleMessage[];
  sources: SourceCard[];
  insufficientEvidence?: boolean;
};

const registration = MOCK_GUIDES[3];
const planning = MOCK_GUIDES[0];
const simasterKrs = MOCK_GUIDES[13];
const labSop = MOCK_GUIDES[8];
const kmtedi = MOCK_GUIDES[12];
const internshipTri = MOCK_GUIDES[9];
const certifications = MOCK_GUIDES[11];

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

export const SAMPLE_SCENARIOS: SampleScenario[] = [
  {
    id: "krs-clash",
    label: "Course clash & KRS",
    messages: SAMPLE_MESSAGES,
    sources: SAMPLE_SOURCES,
  },
  {
    id: "tri-lab-sop",
    label: "D4 TRI lab SOP",
    messages: [
      {
        id: "lab-1",
        role: "user",
        text: "What should I prepare before my first D4 TRI networking lab session at SV UGM?",
      },
      {
        id: "lab-2",
        role: "assistant",
        text: "Arrive at least 10 minutes early in collared attire with your lab coat and official module, and configure switches or routers via console cable before connecting to live topology [1]. Make sure your NetAcad and eLOK accounts are active, and consider joining KMTEDI's Networking Study Group for extra practice [2].",
        citations: [1, 2],
      },
    ],
    sources: [
      {
        index: 1,
        title: labSop.title,
        sourceType: labSop.source_type,
        lastVerifiedAt: labSop.last_verified_at,
        guideId: labSop.id,
      },
      {
        index: 2,
        title: kmtedi.title,
        sourceType: kmtedi.source_type,
        lastVerifiedAt: kmtedi.last_verified_at,
        guideId: kmtedi.id,
      },
    ],
  },
  {
    id: "tri-internship",
    label: "6-month internship & certs",
    messages: [
      {
        id: "int-1",
        role: "user",
        text: "When should I apply for the 6-month D4 TRI internship and which certifications help?",
      },
      {
        id: "int-2",
        role: "assistant",
        text: "Submit your internship proposal to the TRI Internship Coordinator at least 2 months before your Semester 7 placement begins; the 6-month industry stint converts into 20 SKS [1]. For certifications, LSP SV UGM recommends MTCNA, CCNA, or RHCSA and runs subsidized exam vouchers each even semester [2].",
        citations: [1, 2],
      },
    ],
    sources: [
      {
        index: 1,
        title: internshipTri.title,
        sourceType: internshipTri.source_type,
        lastVerifiedAt: internshipTri.last_verified_at,
        guideId: internshipTri.id,
      },
      {
        index: 2,
        title: certifications.title,
        sourceType: certifications.source_type,
        lastVerifiedAt: certifications.last_verified_at,
        guideId: certifications.id,
      },
    ],
  },
  {
    id: "insufficient-evidence",
    label: "Missing rule fallback",
    insufficientEvidence: true,
    messages: [
      {
        id: "miss-1",
        role: "user",
        text: "Can I borrow a faculty router over the semester break for my personal kos setup?",
      },
      {
        id: "miss-2",
        role: "assistant",
        text: "I do not have enough verified campus evidence to confirm off-campus holiday equipment loans. Rather than guessing, ask senior students in Community or confirm directly with your faculty lab coordinator.",
        citations: [],
      },
    ],
    sources: [
      {
        index: 1,
        title: simasterKrs.title,
        sourceType: simasterKrs.source_type,
        lastVerifiedAt: simasterKrs.last_verified_at,
        guideId: simasterKrs.id,
      },
    ],
  },
];

/** Matches an incoming `?q=` from Knowledge Hub to the closest demo scenario. */
export function pickInitialScenarioId(query?: string): string {
  if (!query) return SAMPLE_SCENARIOS[0].id;
  const q = query.toLowerCase();
  if (q.includes("lab") || q.includes("jaringan") || q.includes("kmtedi")) {
    return "tri-lab-sop";
  }
  if (
    q.includes("magang") ||
    q.includes("internship") ||
    q.includes("sertifikasi") ||
    q.includes("ccna")
  ) {
    return "tri-internship";
  }
  return SAMPLE_SCENARIOS[0].id;
}

/** The citation numbers used in a message text, e.g. "[2] ... [1]" gives [2, 1]. */
export function citationNumbers(text: string): number[] {
  return [...text.matchAll(/\[(\d+)\]/g)].map((match) => Number(match[1]));
}
