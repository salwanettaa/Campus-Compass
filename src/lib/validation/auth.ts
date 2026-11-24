import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email address.").max(254),
  password: z.string().min(1, "Enter your password.").max(128),
});

export const registerSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters.")
    .max(30, "Use at most 30 characters."),
  email: z.email("Enter a valid email address.").max(254),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(128, "Use at most 128 characters.")
    .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), {
      message: "Include at least one letter and one number.",
    }),
  acceptPrivacy: z.literal(true, {
    error: "You need to accept the privacy notice to continue.",
  }),
});

export type FormState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const initialFormState: FormState = { ok: false };
