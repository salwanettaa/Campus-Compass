import { describe, expect, it } from "vitest";
import { containsPersonalData } from "./personal-data";

describe("containsPersonalData: must be detected", () => {
  it.each([
    // emails
    "write to a@b.co",
    "budi@example.com",
    "budi @ example . com",
    "budi(at)example(dot)com",
    "BUDI.S+tag@Gmail.com",
    // student IDs (NIM)
    "my NIM is 2301234567",
    "NIM:23012345",
    // Indonesian mobile numbers in many formats
    "08123456789",
    "0812-3456-7890",
    "0812 3456 7890",
    "0812.3456.7890",
    "0812/3456/7890",
    "(0812) 3456 7890",
    "+62 812 3456 7890",
    "+62-812-3456-7890",
    "+62 (812) 3456-7890",
    "62 812 3456 7890",
    "+6281234567890",
    // digits spaced out one by one
    "0 8 1 2 3 4 5 6 7 8 9 0",
    "0-8-1-2-3-4-5-6-7-8",
    // landline with area code
    "(021) 1234 5678",
    "021-555-1234",
    // embedded in a sentence
    "text me on 0812-3456-7890 after class",
    "call +62 812 3456 7890.",
  ])("detects %j", (value) => {
    expect(containsPersonalData(value)).toBe(true);
  });
});

describe("containsPersonalData: must be allowed (false positives)", () => {
  it.each([
    // dates
    "deadline 24-11-2026",
    "deadline 24/11/2026",
    "deadline 24.11.2026",
    "registered on 2026-11-24",
    "from 24-11-2026 to 28-11-2026",
    "24-11-2026 - 28-11-2026",
    // year ranges
    "the 2024-2025 academic year",
    "the 2024/2025 academic year",
    "between 2019 and 2023",
    "in 2019, 2020, and 2021",
    // semester and credits
    "I took 24 credits in semester 3",
    "semester 1, 2, 3, 4, 5, 6, 7, 8",
    // GPA and scores
    "my GPA went from 2.85 to 3.75",
    "my GPA is 3,8 out of 4.0",
    "I scored 85 and 90",
    "I got 100%",
    // money, time, other small numbers
    "the fee was Rp 2.500.000 per semester",
    "I studied 3 hours a day for 14 weeks",
    "class starts at 07.30 in room 12",
    "room 301, building 2",
    // plain text
    "I joined the robotics club and it changed my semester",
  ])("allows %j", (value) => {
    expect(containsPersonalData(value)).toBe(false);
  });
});

describe("containsPersonalData: known limits", () => {
  it("does not catch spelled-out digits (documented limit)", () => {
    expect(containsPersonalData("zero eight one two three four five six")).toBe(
      false,
    );
  });
});
