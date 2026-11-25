import type { Metadata } from "next";
import { ArrowDown, House, Route, Search, User, Users } from "lucide-react";
import { PasswordInput } from "@/components/auth/password-input";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChoiceCard } from "@/components/ui/choice-card";
import { FilterChips } from "@/components/ui/chip";
import { Field } from "@/components/ui/field";
import { GuideCard } from "@/components/ui/guide-card";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SearchBar } from "@/components/ui/search-bar";
import { Select } from "@/components/ui/select";
import type { Campus, Faculty, Program } from "@/types/database";

// Sample data so the onboarding wizard can be previewed without Supabase.
const SAMPLE_CAMPUSES: Campus[] = [
  { id: "00000000-0000-4000-8000-000000000001", name: "Sample University", slug: "sample", domain: "sample.ac.id", is_active: true },
];
const SAMPLE_FACULTIES: Faculty[] = [
  { id: "00000000-0000-4000-8000-000000000011", campus_id: SAMPLE_CAMPUSES[0].id, name: "Faculty of Engineering", code: "FT" },
];
const SAMPLE_PROGRAMS: Program[] = [
  { id: "00000000-0000-4000-8000-000000000021", campus_id: SAMPLE_CAMPUSES[0].id, faculty_id: SAMPLE_FACULTIES[0].id, name: "Informatics", code: "IF", degree_level: "Undergraduate", is_pilot: true },
];

export const metadata: Metadata = {
  title: "Design System",
  robots: { index: false },
};

// Class names are written out in full so Tailwind can detect them.
const PALETTE = [
  { token: "paper", hex: "#f5f3ec", cls: "bg-paper text-brand-950" },
  { token: "paper-raised", hex: "#fbfaf6", cls: "bg-paper-raised text-brand-950" },
  { token: "brand-950", hex: "#04202e", cls: "bg-brand-950 text-white" },
  { token: "brand-900", hex: "#0a3c55", cls: "bg-brand-900 text-white" },
  { token: "brand-800", hex: "#0f5d83", cls: "bg-brand-800 text-white" },
  { token: "brand-700", hex: "#1279a2", cls: "bg-brand-700 text-white" },
  { token: "brand-600", hex: "#1786b4", cls: "bg-brand-600 text-white", chip: true },
  { token: "brand-400", hex: "#4fb2db", cls: "bg-brand-400 text-brand-950" },
  { token: "brand-300", hex: "#98d4ee", cls: "bg-brand-300 text-brand-950" },
  { token: "brand-100", hex: "#e1f2fa", cls: "bg-brand-100 text-brand-950" },
] as const;

const TYPE_SCALE = [
  { cls: "text-h1", name: "Heading 1", spec: "Poppins Bold 32 / 40", sample: "Campus Compass" },
  { cls: "text-h2", name: "Heading 2", spec: "Poppins SemiBold 26 / 34", sample: "Explore Your Campus" },
  { cls: "text-h3", name: "Heading 3", spec: "Poppins SemiBold 20 / 28", sample: "Recommended for You" },
  { cls: "text-h4", name: "Heading 4", spec: "Poppins Medium 16 / 24", sample: "Academic Resources" },
  { cls: "text-h5", name: "Heading 5", spec: "Poppins Medium 14 / 20", sample: "Recently Added" },
  { cls: "text-body", name: "Body", spec: "Poppins Regular 14 / 22", sample: "Discover helpful campus resources and connect with fellow students." },
  { cls: "text-caption", name: "Caption", spec: "Poppins Regular 12 / 18", sample: "Updated November 2026" },
] as const;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <h2 className="text-h2 text-brand-950">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 py-10">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1 text-brand-950">Design System</h1>
        <p className="text-body text-brand-800">
          Campus Compass foundations: Poppins, campus blues, paper surfaces,
          and practical components.
        </p>
      </header>

      <Section title="Typography">
        <div className="flex flex-col divide-y divide-brand-300/60 border border-brand-950/10 bg-paper-raised p-2">
          {TYPE_SCALE.map((row) => (
            <div
              key={row.name}
              className="grid items-baseline gap-2 px-5 py-4 md:grid-cols-[9rem_1fr_14rem]"
            >
              <span className="text-h5 text-brand-800">{row.name}</span>
              <span className={`${row.cls} text-brand-950`}>{row.sample}</span>
              <span className="text-caption text-brand-800">{row.spec}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Color palette">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {PALETTE.map((color) => (
            <div
              key={color.token}
              className={`${color.cls} flex aspect-square flex-col justify-end rounded-xl border border-brand-950/10 p-4`}
            >
              <span
                className={
                  "chip" in color && color.chip
                    ? "flex w-fit flex-col rounded-xl bg-white px-2 py-1 text-brand-950"
                    : "flex flex-col"
                }
              >
                <span className="text-h5">{color.token}</span>
                <span className="text-caption uppercase">{color.hex}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-4 border border-brand-950/10 bg-paper-raised p-6">
          <Button size="lg">
            Get Started
            <ArrowDown className="size-5" aria-hidden="true" />
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
          <Button>Medium</Button>
          <Button size="sm">Small</Button>
          <Button loading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-xl bg-brand-950 p-6">
            <Button variant="pillOnDark" size="sm">
              Sign Up
            </Button>
          </div>
          <div className="rounded-xl border border-brand-950/10 bg-paper-raised p-6">
            <Button variant="pillOnLight" size="sm">
              Sign Up
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Icon buttons">
        <div className="flex flex-wrap items-center gap-4 border border-brand-950/10 bg-paper-raised p-6">
          <IconButton variant="solid" aria-label="Home">
            <House />
          </IconButton>
          <IconButton aria-label="Search">
            <Search />
          </IconButton>
          <IconButton aria-label="My Journey">
            <Route />
          </IconButton>
          <IconButton aria-label="Community">
            <Users />
          </IconButton>
          <IconButton aria-label="Profile">
            <User />
          </IconButton>
        </div>
      </Section>

      <Section title="Search and filters">
        <div className="flex flex-col gap-4">
          <SearchBar variant="dark" />
          <SearchBar variant="light" />
          <FilterChips
            label="Category"
            options={["All", "Academic", "Community", "Events", "Facilities"]}
          />
        </div>
      </Section>

      <Section title="Forms">
        <div className="grid gap-6 border border-brand-950/10 bg-paper-raised p-6 md:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Field htmlFor="ds-name" label="Display name" hint="A nickname other students will see.">
              <Input id="ds-name" placeholder="e.g. Rifal" />
            </Field>
            <Field htmlFor="ds-email" label="Email" error="Enter a valid email address.">
              <Input id="ds-email" defaultValue="not-an-email" invalid />
            </Field>
            <Field htmlFor="ds-pass" label="Password">
              <PasswordInput id="ds-pass" placeholder="Create a password" />
            </Field>
            <Field htmlFor="ds-select" label="Semester">
              <Select id="ds-select" defaultValue="">
                <option value="">Select your semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
              </Select>
            </Field>
            <Checkbox id="ds-check" label="I agree to the privacy notice." />
          </div>
          <div className="flex flex-col gap-4">
            <Alert variant="info" title="Info">Neutral guidance for the user.</Alert>
            <Alert variant="success" title="Success">Your action went through.</Alert>
            <Alert variant="error" title="Error">Something needs your attention.</Alert>
            <div className="grid grid-cols-2 gap-3">
              <ChoiceCard name="ds-choice" value="a" title="Academic" description="Courses and exams." defaultChecked />
              <ChoiceCard name="ds-choice" value="b" title="Social" description="Friends and clubs." />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Onboarding wizard (sample data)">
        <div className="border border-brand-950/10 bg-paper-raised p-6 sm:p-8">
          <OnboardingForm
            campuses={SAMPLE_CAMPUSES}
            faculties={SAMPLE_FACULTIES}
            programs={SAMPLE_PROGRAMS}
          />
        </div>
      </Section>

      <Section title="Navigation bar">
        <div className="flex flex-col gap-4">
          <Navbar variant="dark" />
          <Navbar variant="light" />
        </div>
      </Section>

      <Section title="Sidebar">
        <div className="flex flex-wrap gap-6">
          <Sidebar variant="dark" user={{ displayName: "Muhammad Rifal" }} />
          <Sidebar variant="light" user={{ displayName: "Muhammad Rifal" }} />
        </div>
      </Section>

      <Section title="Cards">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <GuideCard title="Campus Guide" href="/knowledge" variant="tinted" />
          <GuideCard title="Campus Guide" href="/knowledge" />
          <GuideCard title="Campus Guide" href="/knowledge" />
        </div>
      </Section>
    </main>
  );
}
