import type { Metadata } from "next";
import { CommunityHub } from "@/components/community/community-hub";
import { PageHeader } from "@/components/ui/page-header";
import type { ViewerCommunityProfile } from "@/lib/community/social-types";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Community" };

function toUniversityShort(name: string | null | undefined): string {
  if (!name) return "Campus";
  const lower = name.toLowerCase();
  if (lower.includes("gadjah mada") || lower.includes("ugm")) return "UGM";
  return name;
}

export default async function CommunityPage() {
  let viewer: ViewerCommunityProfile = {
    displayName: "Student",
    universityName: "Universitas Gadjah Mada",
    universityShort: "UGM",
    department: "Teknologi Rekayasa Internet",
  };

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("display_name, campus_id, program_id")
          .eq("id", user.id)
          .maybeSingle();

        if (profile) {
          const [campusRes, programRes] = await Promise.all([
            profile.campus_id
              ? supabase
                  .from("campuses")
                  .select("name")
                  .eq("id", profile.campus_id)
                  .maybeSingle()
              : Promise.resolve({ data: null }),
            profile.program_id
              ? supabase
                  .from("programs")
                  .select("name")
                  .eq("id", profile.program_id)
                  .maybeSingle()
              : Promise.resolve({ data: null }),
          ]);

          const universityShort = toUniversityShort(campusRes.data?.name);
          viewer = {
            displayName: profile.display_name || "Student",
            universityName: campusRes.data?.name ?? "Universitas Gadjah Mada",
            universityShort,
            department:
              programRes.data?.name ?? "Teknologi Rekayasa Internet",
          };
        }
      }
    } catch {
      // Fallback to mock viewer profile for prototype.
    }
  }

  return (
    <main className="flex w-full flex-col gap-6">
      <PageHeader
        title="Community"
        description="Ask questions, share experiences, and connect with students across campuses and departments."
      />
      <CommunityHub viewer={viewer} />
    </main>
  );
}
