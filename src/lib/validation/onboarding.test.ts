import { describe, expect, it } from "vitest";
import {
  ADAPTATION_AREA_VALUES,
  MAIN_CHALLENGE_VALUES,
  MAX_SEMESTER,
  MIN_SEMESTER,
} from "@/lib/constants/onboarding";
import { onboardingSchema } from "./onboarding";

const valid = {
  campusId: "3f2b1c8e-5a4d-4e6f-8a1b-2c3d4e5f6a7b",
  facultyId: "4a3c2d9f-6b5e-4f70-9b2c-3d4e5f6a7b8c",
  programId: "5b4d3eaf-7c6f-4081-8c3d-4e5f6a7b8c9d",
  semester: "3",
  adaptationArea: ADAPTATION_AREA_VALUES[0],
  mainChallenge: MAIN_CHALLENGE_VALUES[0],
};

describe("onboardingSchema", () => {
  it("accepts valid input and coerces semester from form string", () => {
    const result = onboardingSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.semester).toBe(3);
  });

  it.each(["campusId", "facultyId", "programId"] as const)(
    "rejects a non-UUID %s",
    (field) => {
      expect(
        onboardingSchema.safeParse({ ...valid, [field]: "not-a-uuid" }).success,
      ).toBe(false);
    },
  );

  it.each(["campusId", "facultyId", "programId"] as const)(
    "rejects a missing %s",
    (field) => {
      const { [field]: _omit, ...rest } = valid;
      void _omit;
      expect(onboardingSchema.safeParse(rest).success).toBe(false);
    },
  );

  it("accepts the semester boundaries", () => {
    for (const semester of [MIN_SEMESTER, MAX_SEMESTER]) {
      expect(onboardingSchema.safeParse({ ...valid, semester }).success).toBe(
        true,
      );
    }
  });

  it.each([MIN_SEMESTER - 1, MAX_SEMESTER + 1, 2.5, "abc", "", null])(
    "rejects semester %j",
    (semester) => {
      expect(onboardingSchema.safeParse({ ...valid, semester }).success).toBe(
        false,
      );
    },
  );

  it("rejects unknown adaptation area and challenge tokens", () => {
    expect(
      onboardingSchema.safeParse({ ...valid, adaptationArea: "free text" })
        .success,
    ).toBe(false);
    expect(
      onboardingSchema.safeParse({ ...valid, mainChallenge: "my NIM is 123" })
        .success,
    ).toBe(false);
  });

  it("accepts every declared adaptation area and challenge", () => {
    for (const adaptationArea of ADAPTATION_AREA_VALUES) {
      expect(
        onboardingSchema.safeParse({ ...valid, adaptationArea }).success,
      ).toBe(true);
    }
    for (const mainChallenge of MAIN_CHALLENGE_VALUES) {
      expect(
        onboardingSchema.safeParse({ ...valid, mainChallenge }).success,
      ).toBe(true);
    }
  });
});
