import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { Alert } from "@/components/ui/alert";
import { signOutAction } from "@/lib/auth/actions";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

// Everything under the dashboard depends on the signed-in user's session.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseEnv()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("display_name, onboarding_completed")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-5">
        <Alert variant="error" title="We could not load your profile">
          Something went wrong on our side.{" "}
          <Link href="/home" className="underline underline-offset-4">
            Try again
          </Link>
        </Alert>
      </div>
    );
  }

  if (!profile || !profile.onboarding_completed) redirect("/onboarding");

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 p-4 lg:p-6">
      <Sidebar
        user={{ displayName: profile.display_name }}
        onLogout={signOutAction}
        className="sticky top-6 hidden h-[calc(100dvh-3rem)] shrink-0 lg:flex"
      />
      <div className="min-w-0 flex-1 pb-32 lg:pb-0">{children}</div>
      <BottomNav />
    </div>
  );
}
