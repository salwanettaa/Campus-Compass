import { z } from "zod";

export const TASK_CATEGORIES = [
  { value: "social", label: "Social" },
  { value: "academic", label: "Academic" },
  { value: "internship", label: "Internship" },
  { value: "scholarship", label: "Scholarship" },
  { value: "competition", label: "Competition" },
  { value: "personal", label: "Personal" },
] as const;

export const TASK_PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] as const;

const CATEGORY_VALUES = [
  "social",
  "academic",
  "internship",
  "scholarship",
  "competition",
  "personal",
] as const;

const PRIORITY_VALUES = ["low", "medium", "high"] as const;

const optionalTrimmedText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Must be ${max} characters or less.`)
    .optional()
    .nullable()
    .transform((v) => (v && v.length > 0 ? v : null));

const optionalDate = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null))
  .refine((v) => v === null || /^\d{4}-\d{2}-\d{2}$/.test(v), {
    message: "Use a valid date (YYYY-MM-DD).",
  });

const optionalPriority = z
  .union([z.enum(PRIORITY_VALUES), z.literal("")])
  .optional()
  .nullable()
  .transform((v) => (v && v.length > 0 ? v : null));

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a task title.")
    .max(200, "Task title must be 200 characters or less."),
  description: optionalTrimmedText(1000),
  dueDate: optionalDate,
  priority: optionalPriority,
  category: z.enum(CATEGORY_VALUES).default("personal"),
  journeyChecklistId: optionalTrimmedText(120),
});

export const updateTaskSchema = createTaskSchema.extend({
  id: z.uuid("Invalid task ID."),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
