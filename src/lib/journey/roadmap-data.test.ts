import { describe, expect, it } from "vitest";
import {
  ADAPTATION_AREA_VALUES,
  CHALLENGES_BY_AREA,
} from "@/lib/constants/onboarding";
import {
  JOURNEYS,
  findChecklistItemMeta,
  personalizeJourney,
} from "./roadmap-data";

describe("My Journey roadmap data", () => {
  it("defines a roadmap with stages, checklist items, and insights for every adaptation area", () => {
    for (const area of ADAPTATION_AREA_VALUES) {
      const journey = JOURNEYS[area];
      expect(journey.title.length).toBeGreaterThan(0);
      expect(journey.description.length).toBeGreaterThan(0);
      expect(journey.stages.length).toBeGreaterThanOrEqual(4);
      expect(journey.insights.length).toBeGreaterThanOrEqual(5);
      for (const stage of journey.stages) {
        expect(stage.items.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("personalizes the focus stage based on the user's main challenge", () => {
    const scholarshipDocs = personalizeJourney(
      "scholarship",
      "preparing_application_documents",
      {},
      {},
    );
    expect(scholarshipDocs.currentStage.id).toBe("scholarship_stage_3");
    expect(scholarshipDocs.currentStage.isFocus).toBe(true);
    expect(scholarshipDocs.nextAction?.id).toBe("scholarship_stage_3_item_1");

    const competitionTeam = personalizeJourney(
      "competition",
      "finding_teammates",
      {},
      {},
    );
    expect(competitionTeam.currentStage.id).toBe("competition_stage_3");
  });

  it("computes progress dynamically from completed and skipped items", () => {
    const firstItem = JOURNEYS.social.stages[0].items[0].id;
    const secondItem = JOURNEYS.social.stages[0].items[1].id;
    const result = personalizeJourney(
      "social",
      "joining_organizations",
      {
        [firstItem]: "completed",
        [secondItem]: "skipped",
      },
      { [firstItem]: "task-123" },
    );

    expect(result.progress.completed).toBe(1);
    expect(result.progress.skipped).toBe(1);
    expect(result.progress.resolved).toBe(2);
    expect(result.progress.total).toBe(12);
    expect(result.progress.percentage).toBe(Math.round((2 / 12) * 100));
    expect(result.stages[0].items[0].linkedTaskId).toBe("task-123");
  });

  it("maps every area+challenge pair to a valid focus stage", () => {
    for (const area of ADAPTATION_AREA_VALUES) {
      for (const challenge of CHALLENGES_BY_AREA[area]) {
        const result = personalizeJourney(area, challenge.value, {}, {});
        expect(result.stages.some((s) => s.id === result.focusStageId)).toBe(
          true,
        );
      }
    }
  });

  it("finds checklist item metadata by ID", () => {
    const meta = findChecklistItemMeta("internship_stage_3_item_1");
    expect(meta?.area).toBe("internship");
    expect(meta?.item.title).toBe("Create or update your CV.");
    expect(findChecklistItemMeta("nonexistent")).toBeNull();
  });
});
