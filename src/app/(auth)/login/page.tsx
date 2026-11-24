import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Alert } from "@/components/ui/alert";
import { safeNextPath } from "@/lib/auth/redirect";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Log in" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? safeNextPath(params.next) : undefined;
  const authError = params.error === "auth";

  return (
    <>
      <header className="flex flex-col gap-1">
        <h1 className="text-h2 text-brand-950">Welcome back</h1>
        <p className="text-body text-brand-800">
          Log in to continue your campus journey.
        </p>
      </header>

      {!hasSupabaseEnv() ? (
        <Alert variant="info" title="Supabase is not connected">
          Set the Supabase keys in <code>.env.local</code> and restart the dev
          server to enable log in.
        </Alert>
      ) : null}

      {authError ? (
        <Alert variant="error">
          That confirmation link is invalid or has expired. Please log in, or
          sign up again.
        </Alert>
      ) : null}

      <LoginForm next={next} />

      <p className="text-body text-brand-800">
        New to Campus Compass?{" "}
        <Link
          href="/register"
          className="text-h5 text-brand-900 underline underline-offset-4 hover:text-brand-950"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
