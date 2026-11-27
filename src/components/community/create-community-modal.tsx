"use client";

import { useState } from "react";
import {
  Award,
  BookOpen,
  Briefcase,
  Code,
  Compass,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  COMMUNITY_CATEGORIES,
  UGM_DEPARTMENTS,
  type CommunityIconKey,
  type CommunityVisibility,
  type SocialCommunity,
  type ViewerCommunityProfile,
} from "@/lib/community/social-types";
import { cn } from "@/lib/utils";

export const COMMUNITY_ICONS: Record<CommunityIconKey, typeof Compass> = {
  compass: Compass,
  code: Code,
  briefcase: Briefcase,
  award: Award,
  trophy: Trophy,
  users: Users,
  book: BookOpen,
};

const ICON_OPTIONS: { key: CommunityIconKey; label: string }[] = [
  { key: "compass", label: "Compass" },
  { key: "code", label: "Tech" },
  { key: "briefcase", label: "Career" },
  { key: "award", label: "Scholarship" },
  { key: "trophy", label: "Competition" },
  { key: "users", label: "Social" },
  { key: "book", label: "Academic" },
];

const VISIBILITY_OPTIONS: {
  value: CommunityVisibility;
  label: string;
  description: string;
}[] = [
  {
    value: "general",
    label: "General",
    description: "Accessible to all Campus Compass users.",
  },
  {
    value: "university",
    label: "University-specific",
    description: "Focused on students at a specific university.",
  },
  {
    value: "department",
    label: "Major-specific",
    description: "Focused on a specific major within a university.",
  },
];

export type CreateCommunityModalProps = {
  open: boolean;
  viewer: ViewerCommunityProfile;
  onClose: () => void;
  onCreate: (community: Omit<SocialCommunity, "id" | "memberCount" | "isJoined">) => void;
};

export function CreateCommunityModal({
  open,
  viewer,
  onClose,
  onCreate,
}: CreateCommunityModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(COMMUNITY_CATEGORIES[0]);
  const [visibility, setVisibility] = useState<CommunityVisibility>("general");
  const [university, setUniversity] = useState(viewer.universityShort);
  const [department, setDepartment] = useState(viewer.department);
  const [icon, setIcon] = useState<CommunityIconKey>("compass");
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    if (!trimmedName || !trimmedDesc) {
      setError("Community name and short description are required.");
      return;
    }

    onCreate({
      name: trimmedName,
      description: trimmedDesc,
      category,
      visibility,
      university:
        visibility === "university" || visibility === "department"
          ? university.trim() || viewer.universityShort
          : undefined,
      department:
        visibility === "department"
          ? department.trim() || viewer.department
          : undefined,
      icon,
    });

    setName("");
    setDescription("");
    setCategory(COMMUNITY_CATEGORIES[0]);
    setVisibility("general");
    setIcon("compass");
    setError(null);
    onClose();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-community-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper/80 p-4 backdrop-blur-sm"
    >
      <div className="flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-brand-300 bg-paper-raised">
        <div className="flex items-center justify-between border-b border-brand-300 px-5 py-4">
          <h2 id="create-community-title" className="text-h3 text-brand-950">
            Create Community
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-9 items-center justify-center rounded-full text-brand-800 transition-colors hover:bg-brand-100 hover:text-brand-950"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col gap-4 overflow-y-auto p-5"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="comm-name" className="text-h5 text-brand-950">
              Community name <span className="text-route-on-dark">*</span>
            </label>
            <Input
              id="comm-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. UGM AI & Data Builders"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="comm-desc" className="text-h5 text-brand-950">
              Short description <span className="text-route-on-dark">*</span>
            </label>
            <Textarea
              id="comm-desc"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (error) setError(null);
              }}
              placeholder="What is this community about and who should join?"
              className="min-h-20"
              required
            />
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-h5 text-brand-950">Visibility</legend>
            <div className="grid gap-2">
              {VISIBILITY_OPTIONS.map((opt) => {
                const selected = visibility === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setVisibility(opt.value)}
                    className={cn(
                      "flex flex-col items-start gap-0.5 rounded-xl border p-3 text-left transition-colors",
                      selected
                        ? "border-brand-700 bg-brand-100"
                        : "border-brand-300 bg-paper hover:border-brand-600",
                    )}
                  >
                    <span className="text-h5 text-brand-950">{opt.label}</span>
                    <span className="text-caption text-brand-800">
                      {opt.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {visibility === "university" || visibility === "department" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="comm-uni" className="text-h5 text-brand-950">
                  University
                </label>
                <Input
                  id="comm-uni"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="UGM"
                />
              </div>

              {visibility === "department" ? (
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="comm-dept" className="text-h5 text-brand-950">
                    Major
                  </label>
                  <Select
                    id="comm-dept"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  >
                    {UGM_DEPARTMENTS.filter((d) => d !== "All UGM").map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </Select>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="comm-category" className="text-h5 text-brand-950">
              Category (optional)
            </label>
            <Select
              id="comm-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {COMMUNITY_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="text-h5 text-brand-950">Icon (optional)</legend>
            <div className="flex flex-wrap gap-2">
              {ICON_OPTIONS.map((opt) => {
                const Icon = COMMUNITY_ICONS[opt.key];
                const selected = icon === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setIcon(opt.key)}
                    className={cn(
                      "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-caption transition-colors",
                      selected
                        ? "border-brand-700 bg-fill font-semibold text-white"
                        : "border-brand-300 bg-paper text-brand-800 hover:border-brand-600",
                    )}
                  >
                    <Icon className="size-3.5" aria-hidden="true" />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          {error ? <p className="text-caption text-red-700">{error}</p> : null}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Community
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
