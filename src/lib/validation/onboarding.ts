import { z } from "zod";
import {
  ADAPTATION_AREA_VALUES,
  MAIN_CHALLENGE_VALUES,
  MAX_SEMESTER,
  MIN_SEMESTER,
} from "@/lib/constants/onboarding";

export const onboardingSchema = z.object({
  campusId: z.uuid("Choose your campus."),
  facultyId: z.uuid("Choose your faculty."),
  programId: z.uuid("Choose your study program."),
  semester: z.coerce
    .number("Choose your semester.")
    .int()
    .min(MIN_SEMESTER, "Choose your semester.")
    .max(MAX_SEMESTER, "Choose your semester."),
  adaptationArea: z.enum(ADAPTATION_AREA_VALUES, {
    error: "Choose an adaptation area.",
  }),
  mainChallenge: z.enum(MAIN_CHALLENGE_VALUES, {
    error: "Choose your main challenge.",
  }),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
