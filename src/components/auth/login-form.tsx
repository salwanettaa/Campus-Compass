"use client";

import { useActionState } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, fieldAria } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInAction } from "@/lib/auth/actions";
import { initialFormState } from "@/lib/validation/auth";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    signInAction,
    initialFormState,
  );
  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <form action={formAction} noValidate className="flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      {state.message ? <Alert variant="error">{state.message}</Alert> : null}

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

      <Field htmlFor="password" label="Password" error={passwordError}>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          placeholder="Your password"
          invalid={Boolean(passwordError)}
          {...fieldAria("password", passwordError)}
        />
      </Field>

      <Button type="submit" size="lg" loading={pending} className="w-full">
        Log in
      </Button>
    </form>
  );
}
