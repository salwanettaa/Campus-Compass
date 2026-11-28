import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Alert } from "@/components/ui/alert";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Sign up" };

export default function RegisterPage() {
  return (
    <>
      <header className="flex flex-col gap-3">
        <h1 className="text-welcome text-brand-950">
          Create your account
        </h1>
        <p className="text-lead text-brand-800">
          Join your campus community. It only takes a minute.
        </p>
      </header>

      {!hasSupabaseEnv() ? (
        <Alert variant="info" title="Supabase is not connected">
          Set the Supabase keys in <code>.env.local</code> and restart the dev
          server to enable sign up.
        </Alert>
      ) : null}

      <RegisterForm />

      <p className="text-body text-center text-brand-800">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-h5 font-semibold text-brand-700 underline-offset-4 hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}
