/**
 * Onboarding option sets. Values are stable tokens stored in
 * profiles.adaptation_area / profiles.main_challenge (categorized, never free
 * text, so no sensitive personal data ends up in the profile).
 */

export const ADAPTATION_AREAS = [
  {
    value: "academic",
    label: "Academic",
    description: "Courses, assignments, exams, and study systems.",
  },
  {
    value: "social",
    label: "Social",
    description: "Friends, organizations, and communities.",
  },
  {
    value: "administrative",
    label: "Administrative",
    description: "Course registration, procedures, and official services.",
  },
  {
    value: "personal",
    label: "Self-management",
    description: "Time, routines, and balance.",
  },
  {
    value: "facilities",
    label: "Facilities",
    description: "Campus places, transport, and services.",
  },
  {
    value: "opportunity",
    label: "Opportunities",
    description: "Scholarships, competitions, and growth.",
  },
] as const;

export const MAIN_CHALLENGES = [
  { value: "time_management", label: "Time management" },
  { value: "study_methods", label: "Study methods" },
  { value: "finding_friends", label: "Finding friends" },
  { value: "joining_organizations", label: "Joining organizations" },
  { value: "administrative_procedures", label: "Administrative procedures" },
  { value: "campus_facilities", label: "Campus facilities" },
  { value: "scholarships_competitions", label: "Scholarships & competitions" },
  { value: "career_preparation", label: "Career preparation" },
] as const;

export const MIN_SEMESTER = 1;
export const MAX_SEMESTER = 14;

export const ADAPTATION_AREA_VALUES = ADAPTATION_AREAS.map((a) => a.value);
export const MAIN_CHALLENGE_VALUES = MAIN_CHALLENGES.map((c) => c.value);
