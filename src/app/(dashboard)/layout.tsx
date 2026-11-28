import Link from "next/link";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileHeader } from "@/components/layout/mobile-header";
import { QuickJumpDialog } from "@/components/layout/quick-jump";
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
    <div className="flex w-full flex-1">
      <div className="hidden shrink-0 border-r border-brand-300 bg-paper-raised lg:block">
        <Sidebar
          user={{ displayName: profile.display_name }}
          onLogout={signOutAction}
          className="sticky top-0 h-dvh border-r-0 p-3"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <div className="mx-auto w-full max-w-[82rem] flex-1 px-4 pt-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-8 sm:pt-6 lg:px-10 lg:py-8">
          {children}
        </div>
      </div>
      <BottomNav onLogout={signOutAction} />
      <QuickJumpDialog />
    </div>
  );
}
