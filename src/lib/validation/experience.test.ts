import { describe, expect, it } from "vitest";
import { containsPersonalData, experienceSchema } from "./experience";

const text = (label: string) =>
  `${label}: a clear description with enough characters.`;

const valid = {
  title: "How I planned my first midterms",
  semesterContext: "3",
  situation: text("situation"),
  challenge: text("challenge"),
  solution: text("solution"),
  result: text("result"),
  adviceForJuniors: text("advice"),
  tags: "Study Group, midterms",
  acknowledgePersonal: true,
};

describe("experienceSchema", () => {
  it("accepts valid input and normalizes tags and semester", () => {
    const result = experienceSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["study-group", "midterms"]);
      expect(result.data.semesterContext).toBe(3);
    }
  });

  it("allows an empty semester and missing tags", () => {
    const result = experienceSchema.safeParse({
      ...valid,
      semesterContext: "",
      tags: undefined,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.semesterContext).toBeUndefined();
      expect(result.data.tags).toEqual([]);
    }
  });

  it.each(["situation", "challenge", "solution", "result", "adviceForJuniors"])(
    "rejects a too short %s",
    (field) => {
      expect(
        experienceSchema.safeParse({ ...valid, [field]: "too short" }).success,
      ).toBe(false);
    },
  );

  it("rejects over-long text", () => {
    expect(
      experienceSchema.safeParse({ ...valid, situation: "x".repeat(2001) })
        .success,
    ).toBe(false);
  });

  it.each(["0", "15", "2.5", "abc"])("rejects semester %s", (semesterContext) => {
    expect(
      experienceSchema.safeParse({ ...valid, semesterContext }).success,
    ).toBe(false);
  });

  it("rejects more than 5 tags", () => {
    expect(
      experienceSchema.safeParse({ ...valid, tags: "a,b,c,d,e,f" }).success,
    ).toBe(false);
  });

  it("requires the personal-experience acknowledgement", () => {
    expect(
      experienceSchema.safeParse({ ...valid, acknowledgePersonal: false })
        .success,
    ).toBe(false);
  });

  it("rejects personal data in the text fields", () => {
    const withEmail = text("situation") + " Mail me at budi@example.com";
    expect(
      experienceSchema.safeParse({ ...valid, situation: withEmail }).success,
    ).toBe(false);
  });
});

describe("containsPersonalData", () => {
  it.each([
    "write to a@b.co",
    "my NIM is 2301234567",
    "call 0812-3456-7890",
    "call +62 812 3456 7890",
  ])("detects %j", (value) => {
    expect(containsPersonalData(value)).toBe(true);
  });

  it.each([
    "I studied 3 hours a day in semester 5",
    "the 2024-2025 academic year",
    "deadline 24-11-2026",
    "I scored 85 and 90",
  ])("allows %j", (value) => {
    expect(containsPersonalData(value)).toBe(false);
  });
});

describe("experienceSchema: personal data in every field", () => {
  const withField = (field: string, value: string) =>
    experienceSchema.safeParse({ ...valid, [field]: value });

  it.each(["title", "situation", "challenge", "solution", "result", "adviceForJuniors"])(
    "rejects a phone number in %s",
    (field) => {
      const value = `Some context for the reader, call +62 (812) 3456-7890 now`;
      expect(withField(field, value).success).toBe(false);
    },
  );

  it.each([
    "budi@example.com",
    "study, budi@example.com",
    "0812-3456-7890",
    "08123456789",
    "0812, 3456, 7890",
    "NIM 2301234567",
  ])("rejects personal data in tags: %j", (tags) => {
    const result = withField("tags", tags);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["tags"]);
    }
  });

  it("still accepts normal tags, dates and GPA in the text fields", () => {
    const result = experienceSchema.safeParse({
      ...valid,
      tags: "gpa, semester-3, 2024-2025",
      situation:
        "In the 2024-2025 year my GPA moved from 2.85 to 3.75 before 24-11-2026.",
    });
    expect(result.success).toBe(true);
  });
});
