import { describe, expect, it } from "vitest";
import { createTaskSchema, updateTaskSchema } from "./validation";

describe("createTaskSchema", () => {
  it("allows quick-add with only a title", () => {
    const result = createTaskSchema.safeParse({
      title: "Prepare scholarship essay",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        title: "Prepare scholarship essay",
        description: null,
        dueDate: null,
        priority: null,
        category: "personal",
        journeyChecklistId: null,
      });
    }
  });

  it("rejects empty or whitespace-only titles", () => {
    expect(createTaskSchema.safeParse({ title: "" }).success).toBe(false);
    expect(createTaskSchema.safeParse({ title: "   " }).success).toBe(false);
  });

  it("accepts optional description, dueDate, priority, and category", () => {
    const result = createTaskSchema.safeParse({
      title: "Update my CV",
      description: "Add latest course project",
      dueDate: "2026-12-01",
      priority: "high",
      category: "internship",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.dueDate).toBe("2026-12-01");
      expect(result.data.priority).toBe("high");
      expect(result.data.category).toBe("internship");
    }
  });

  it("rejects invalid date formats", () => {
    expect(
      createTaskSchema.safeParse({ title: "Test", dueDate: "tomorrow" })
        .success,
    ).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("requires a valid UUID id", () => {
    expect(
      updateTaskSchema.safeParse({ id: "bad", title: "Test" }).success,
    ).toBe(false);
    expect(
      updateTaskSchema.safeParse({
        id: "3f2b1c8e-5a4d-4e6f-8a1b-2c3d4e5f6a7b",
        title: "Updated task",
      }).success,
    ).toBe(true);
  });
});
