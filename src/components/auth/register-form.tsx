"use client";

import { useActionState } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, fieldAria } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signUpAction } from "@/lib/auth/actions";
import { initialFormState } from "@/lib/validation/auth";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialFormState,
  );

  if (state.ok) {
    return (
      <Alert variant="success" title="Check your email">
        {state.message}
      </Alert>
    );
  }

  const nameError = state.fieldErrors?.displayName?.[0];
  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];
  const privacyError = state.fieldErrors?.acceptPrivacy?.[0];

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {state.message ? <Alert variant="error">{state.message}</Alert> : null}

      <Field
        htmlFor="displayName"
        label="Display name"
        hint="A nickname other students will see. Please don't use your real name or student ID."
        error={nameError}
      >
        <Input
          id="displayName"
          name="displayName"
          autoComplete="nickname"
          placeholder="e.g. Rifal"
          invalid={Boolean(nameError)}
          {...fieldAria("displayName", nameError, "hint")}
        />
      </Field>

      <Field htmlFor="email" label="Email" error={emailError}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@student.ac.id"
          invalid={Boolean(emailError)}
          {...fieldAria("email", emailError)}
        />
      </Field>

      <Field
        htmlFor="password"
        label="Password"
        hint="At least 8 characters, with a letter and a number."
        error={passwordError}
      >
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          placeholder="Create a password"
          invalid={Boolean(passwordError)}
          {...fieldAria("password", passwordError, "hint")}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <Checkbox
          id="acceptPrivacy"
          name="acceptPrivacy"
          invalid={Boolean(privacyError)}
          label="I agree to the privacy notice. Campus Compass only keeps my email, nickname, campus and study program."
        />
        {privacyError ? (
          <p role="alert" className="text-caption text-red-700">
            {privacyError}
          </p>
        ) : null}
      </div>

      <Button type="submit" size="lg" loading={pending} className="w-full">
        Create account
      </Button>
    </form>
  );
}
