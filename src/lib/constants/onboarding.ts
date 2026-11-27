/**
 * Onboarding option sets. Values are stable tokens stored in
 * profiles.adaptation_area / profiles.main_challenge (categorized, never free
 * text, so no sensitive personal data ends up in the profile).
 */

export const ADAPTATION_AREAS = [
  {
    value: "social",
    label: "Social",
    description: "Organizations, communities, and social connections.",
  },
  {
    value: "academic",
    label: "Academic",
    description: "Courses, assignments, exams, and study systems.",
  },
  {
    value: "internship",
    label: "Internship",
    description: "Career exploration, internship preparation, and applications.",
  },
  {
    value: "scholarship",
    label: "Scholarship",
    description:
      "Scholarship opportunities, eligibility, and application preparation.",
  },
  {
    value: "competition",
    label: "Competition",
    description: "Competitions, team preparation, projects, and submissions.",
  },
] as const;

export type AdaptationArea = (typeof ADAPTATION_AREAS)[number]["value"];

export type ChallengeOption = {
  readonly value: string;
  readonly label: string;
};

export const CHALLENGES_BY_AREA = {
  social: [
    { value: "finding_friends", label: "Finding friends" },
    { value: "joining_organizations", label: "Joining organizations" },
    { value: "finding_communities", label: "Finding communities" },
  ],
  academic: [
    { value: "study_methods", label: "Study methods" },
    {
      value: "understanding_academic_systems",
      label: "Understanding academic systems",
    },
    {
      value: "time_management_academic",
      label: "Time management for academic work",
    },
  ],
  internship: [
    { value: "career_exploration", label: "Career exploration" },
    {
      value: "finding_internship_opportunities",
      label: "Finding internship opportunities",
    },
    { value: "application_preparation", label: "Application preparation" },
    { value: "interview_preparation", label: "Interview preparation" },
  ],
  scholarship: [
    {
      value: "finding_suitable_scholarships",
      label: "Finding suitable scholarships",
    },
    { value: "understanding_eligibility", label: "Understanding eligibility" },
    {
      value: "preparing_application_documents",
      label: "Preparing application documents",
    },
    {
      value: "scholarship_application_preparation",
      label: "Scholarship application preparation",
    },
  ],
  competition: [
    {
      value: "finding_suitable_competitions",
      label: "Finding suitable competitions",
    },
    { value: "finding_teammates", label: "Finding teammates" },
    {
      value: "developing_ideas_projects",
      label: "Developing ideas and projects",
    },
    {
      value: "preparing_competition_submissions",
      label: "Preparing competition submissions",
    },
  ],
} as const satisfies Record<AdaptationArea, readonly ChallengeOption[]>;

export type MainChallenge =
  (typeof CHALLENGES_BY_AREA)[AdaptationArea][number]["value"];

export const MAIN_CHALLENGES: readonly {
  value: MainChallenge;
  label: string;
  area: AdaptationArea;
}[] = (Object.keys(CHALLENGES_BY_AREA) as AdaptationArea[]).flatMap((area) =>
  CHALLENGES_BY_AREA[area].map((item) => ({
    value: item.value as MainChallenge,
    label: item.label,
    area,
  })),
);

export const MIN_SEMESTER = 1;
export const MAX_SEMESTER = 14;

export const ADAPTATION_AREA_VALUES = ADAPTATION_AREAS.map((a) => a.value) as [
  AdaptationArea,
  ...AdaptationArea[],
];

export const MAIN_CHALLENGE_VALUES = MAIN_CHALLENGES.map((c) => c.value) as [
  MainChallenge,
  ...MainChallenge[],
];

export function getChallengesForArea(area: string | null | undefined) {
  if (!area || !(area in CHALLENGES_BY_AREA)) return [];
  return CHALLENGES_BY_AREA[area as AdaptationArea];
}

export function isValidChallengeForArea(
  area: string | null | undefined,
  challenge: string | null | undefined,
): boolean {
  if (!area || !challenge) return false;
  return getChallengesForArea(area).some((item) => item.value === challenge);
}

/** Legacy community/profile labels preserved for backward compatibility. */
export const LEGACY_AREA_LABELS: Record<string, string> = {
  administrative: "Administrative",
  personal: "Self-management",
  facilities: "Facilities",
  opportunity: "Opportunities",
};

const LEGACY_AREA_MAP: Record<string, AdaptationArea> = {
  administrative: "academic",
  personal: "academic",
  facilities: "social",
  opportunity: "internship",
};

const LEGACY_CHALLENGE_MAP: Record<
  string,
  { area?: AdaptationArea; challenge: MainChallenge }
> = {
  time_management: { challenge: "time_management_academic" },
  administrative_procedures: { challenge: "understanding_academic_systems" },
  campus_facilities: { challenge: "finding_communities" },
  scholarships_competitions: {
    area: "scholarship",
    challenge: "finding_suitable_scholarships",
  },
  career_preparation: {
    area: "internship",
    challenge: "career_exploration",
  },
};

export type NormalizedAdaptationProfile = {
  area: AdaptationArea;
  challenge: MainChallenge;
  migratedFromLegacy: boolean;
};

/**
 * Safely maps any stored profile adaptation_area / main_challenge (including
 * legacy 6-area tokens or null) to a valid current 5-area profile.
 */
export function normalizeAdaptationProfile(
  rawArea: string | null | undefined,
  rawChallenge: string | null | undefined,
): NormalizedAdaptationProfile {
  const isCurrentArea =
    typeof rawArea === "string" &&
    ADAPTATION_AREA_VALUES.includes(rawArea as AdaptationArea);

  const legacyChallengeEntry =
    typeof rawChallenge === "string"
      ? LEGACY_CHALLENGE_MAP[rawChallenge]
      : undefined;

  let area: AdaptationArea;
  let migratedFromLegacy = false;

  if (isCurrentArea) {
    area = rawArea as AdaptationArea;
  } else if (typeof rawArea === "string" && rawArea in LEGACY_AREA_MAP) {
    area =
      rawArea === "opportunity" && legacyChallengeEntry?.area
        ? legacyChallengeEntry.area
        : LEGACY_AREA_MAP[rawArea];
    migratedFromLegacy = true;
  } else {
    area = "academic";
    migratedFromLegacy = Boolean(rawArea);
  }

  let challenge: MainChallenge;
  if (isValidChallengeForArea(area, rawChallenge)) {
    challenge = rawChallenge as MainChallenge;
  } else if (
    legacyChallengeEntry &&
    isValidChallengeForArea(area, legacyChallengeEntry.challenge)
  ) {
    challenge = legacyChallengeEntry.challenge;
    migratedFromLegacy = true;
  } else {
    challenge = CHALLENGES_BY_AREA[area][0].value as MainChallenge;
    if (rawChallenge) migratedFromLegacy = true;
  }

  return { area, challenge, migratedFromLegacy };
}
