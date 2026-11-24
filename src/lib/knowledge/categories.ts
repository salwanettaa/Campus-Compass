import type { GuideCategory } from "./types";

export const CATEGORY_INFO: Record<
  GuideCategory,
  { label: string; description: string }
> = {
  academic_survival: {
    label: "Academic Survival",
    description: "Study systems, exams, and course planning.",
  },
  social_community: {
    label: "Social & Community",
    description: "Friends, organizations, and campus life.",
  },
  administrative_guide: {
    label: "Administrative Guide",
    description: "Registration, documents, and official procedures.",
  },
  campus_essentials: {
    label: "Campus Essentials",
    description: "Facilities, services, and everyday practicalities.",
  },
  scholarship_growth: {
    label: "Scholarship & Growth",
    description: "Scholarships, competitions, and personal development.",
  },
  career_preparation: {
    label: "Career Preparation",
    description: "Internships, skills, and getting job-ready.",
  },
};

export function categoryName(category: GuideCategory) {
  return CATEGORY_INFO[category].label;
}

const SOURCE_LABELS: Record<string, string> = {
  official_campus_source: "Official campus source",
  curated_guide: "Curated guide",
  senior_experience: "Senior experience",
};

/** Human label for `guides.source_type`; unknown tokens are made readable. */
export function sourceLabel(sourceType: string) {
  const known = SOURCE_LABELS[sourceType];
  if (known) return known;
  const text = sourceType.replace(/_/g, " ").trim();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export const PERSONAL_EXPERIENCE_LABEL =
  "Personal experience, not official information";
