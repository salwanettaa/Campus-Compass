import { describe, expect, it } from "vitest";
import { submitExperienceAction } from "./actions";
import { initialFormState } from "@/lib/validation/auth";

function form(overrides: Record<string, string> = {}) {
  const data = new FormData();
  const base: Record<string, string> = {
    title: "How I planned my first midterms",
    semesterContext: "3",
    situation: "I had three exams in one week and no plan at all.",
    challenge: "I could not decide what to study first each day.",
    solution: "I made a daily plan and studied hardest topics first.",
    result: "I finished all exams and my grades improved a lot.",
    adviceForJuniors: "Start the plan two weeks earlier than you think.",
    tags: "midterms, planning",
    acknowledgePersonal: "on",
    ...overrides,
  };
  for (const [key, value] of Object.entries(base)) data.set(key, value);
  return data;
}

describe("submitExperienceAction", () => {
  it("accepts a valid experience and says it is not stored yet", async () => {
    const state = await submitExperienceAction(initialFormState, form());
    expect(state.ok).toBe(true);
    expect(state.message).toContain("not stored");
  });

  it("returns field errors, including one for tags with personal data", async () => {
    const state = await submitExperienceAction(
      initialFormState,
      form({ tags: "budi@example.com", situation: "short" }),
    );
    expect(state.ok).toBe(false);
    expect(state.fieldErrors?.tags?.[0]).toMatch(/remove emails/i);
    expect(state.fieldErrors?.situation).toBeDefined();
  });

  it("requires the personal-experience confirmation", async () => {
    const data = form();
    data.delete("acknowledgePersonal");
    const state = await submitExperienceAction(initialFormState, data);
    expect(state.ok).toBe(false);
    expect(state.fieldErrors?.acknowledgePersonal).toBeDefined();
  });

  it("handles missing fields without throwing", async () => {
    const state = await submitExperienceAction(
      initialFormState,
      new FormData(),
    );
    expect(state.ok).toBe(false);
  });
});
