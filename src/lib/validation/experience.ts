import { z } from "zod";
import { MAX_SEMESTER, MIN_SEMESTER } from "@/lib/constants/onboarding";
import { containsPersonalData } from "./personal-data";

export { containsPersonalData };

const PERSONAL_DATA_MESSAGE =
  "Please remove emails, phone numbers, and student ID numbers.";

function longText(label: string) {
  return z
    .string(`Describe ${label}.`)
    .trim()
    .min(20, "Use at least 20 characters.")
    .max(2000, "Use at most 2000 characters.")
    .refine((value) => !containsPersonalData(value), PERSONAL_DATA_MESSAGE);
}

/**
 * Tags are checked as typed, and again with the commas turned into spaces, so
 * a phone number cannot be hidden by splitting it over several tags.
 */
const tagsField = z
  .string()
  .optional()
  .refine(
    (value) =>
      !containsPersonalData(value ?? "") &&
      !containsPersonalData((value ?? "").replace(/,/g, " ")),
    PERSONAL_DATA_MESSAGE,
  )
  .transform((value) =>
    (value ?? "")
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean),
  )
  .pipe(
    z
      .array(z.string().max(30, "Each tag can have at most 30 characters."))
      .max(5, "Use at most 5 tags."),
  );

/** Structured senior experience; fields map to the `experiences` columns. */
export const experienceSchema = z.object({
  title: z
    .string("Enter a title.")
    .trim()
    .min(8, "Use at least 8 characters.")
    .max(300, "Use at most 300 characters.")
    .refine((value) => !containsPersonalData(value), PERSONAL_DATA_MESSAGE),
  semesterContext: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.coerce
      .number("Choose a valid semester.")
      .int()
      .min(MIN_SEMESTER, "Choose a valid semester.")
      .max(MAX_SEMESTER, "Choose a valid semester.")
      .optional(),
  ),
  situation: longText("your situation"),
  challenge: longText("the challenge"),
  solution: longText("what you did"),
  result: longText("the result"),
  adviceForJuniors: longText("your advice"),
  tags: tagsField,
  acknowledgePersonal: z.literal(true, {
    error: "Please confirm this is your personal experience.",
  }),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
