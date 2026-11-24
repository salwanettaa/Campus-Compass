"use client";

import { useActionState, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ChoiceCard } from "@/components/ui/choice-card";
import { Chip } from "@/components/ui/chip";
import { Field, fieldAria } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import {
  ADAPTATION_AREAS,
  MAIN_CHALLENGES,
  MAX_SEMESTER,
  MIN_SEMESTER,
} from "@/lib/constants/onboarding";
import { cn } from "@/lib/utils";
import { completeOnboardingAction } from "@/app/onboarding/actions";
import { initialFormState } from "@/lib/validation/auth";
import type { Campus, Faculty, Program } from "@/types/database";

const STEPS = ["Campus", "Semester", "Focus"] as const;

const SEMESTERS = Array.from(
  { length: MAX_SEMESTER - MIN_SEMESTER + 1 },
  (_, index) => MIN_SEMESTER + index,
);

export type OnboardingFormProps = {
  campuses: Campus[];
  faculties: Faculty[];
  programs: Program[];
};

export function OnboardingForm({
  campuses,
  faculties,
  programs,
}: OnboardingFormProps) {
  const [state, formAction, pending] = useActionState(
    completeOnboardingAction,
    initialFormState,
  );

  const [step, setStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [campusId, setCampusId] = useState(
    campuses.length === 1 ? campuses[0].id : "",
  );
  const [facultyId, setFacultyId] = useState("");
  const [programId, setProgramId] = useState("");
  const [semester, setSemester] = useState("");
  const [area, setArea] = useState("");
  const [challenge, setChallenge] = useState("");

  const campusFaculties = useMemo(
    () => faculties.filter((faculty) => faculty.campus_id === campusId),
    [faculties, campusId],
  );
  const facultyPrograms = useMemo(
    () =>
      programs.filter(
        (program) =>
          program.campus_id === campusId && program.faculty_id === facultyId,
      ),
    [programs, campusId, facultyId],
  );

  const stepValid = [
    Boolean(campusId && facultyId && programId),
    Boolean(semester),
    Boolean(area && challenge),
  ];

  function goNext() {
    if (!stepValid[step]) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  }

  function goBack() {
    setShowErrors(false);
    setStep((current) => Math.max(current - 1, 0));
  }

  // Inline errors only appear after the user tries to continue.
  const errorFor = (value: string, message: string) =>
    showErrors && !value ? message : undefined;
  const campusError = errorFor(campusId, "Choose your campus.");
  const facultyError = errorFor(facultyId, "Choose your faculty.");
  const programError = errorFor(programId, "Choose your study program.");
  const semesterError = errorFor(semester, "Choose your semester.");

  return (
    <form action={formAction} noValidate className="flex flex-col gap-8">
      {/* Values from every step are submitted together. */}
      <input type="hidden" name="campusId" value={campusId} />
      <input type="hidden" name="facultyId" value={facultyId} />
      <input type="hidden" name="programId" value={programId} />
      <input type="hidden" name="semester" value={semester} />
      <input type="hidden" name="adaptationArea" value={area} />
      <input type="hidden" name="mainChallenge" value={challenge} />

      <ol aria-label="Progress" className="flex items-center gap-2">
        {STEPS.map((label, index) => {
          const done = index < step;
          const current = index === step;
          return (
            <li
              key={label}
              aria-current={current ? "step" : undefined}
              className="flex flex-1 flex-col gap-2"
            >
              <span
                className={cn(
                  "h-1.5 rounded-full transition-colors duration-300",
                  done || current ? "bg-brand-800" : "bg-brand-300/70",
                )}
              />
              <span
                className={cn(
                  "flex items-center gap-1.5 text-caption",
                  current ? "text-brand-950" : "text-brand-800",
                )}
              >
                {done ? (
                  <Check className="size-3.5" aria-hidden="true" />
                ) : (
                  <span aria-hidden="true">{index + 1}.</span>
                )}
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      {state.message ? <Alert variant="error">{state.message}</Alert> : null}

      {step === 0 ? (
        <section className="flex flex-col gap-5">
          <header className="flex flex-col gap-1">
            <h2 className="text-h3 text-brand-950">Where do you study?</h2>
            <p className="text-body text-brand-800">
              We use this to show content that matches your campus and program.
            </p>
          </header>

          <Field htmlFor="campus" label="Campus" error={campusError}>
            <Select
              id="campus"
              value={campusId}
              onChange={(event) => {
                setCampusId(event.target.value);
                setFacultyId("");
                setProgramId("");
              }}
              invalid={Boolean(campusError)}
              {...fieldAria("campus", campusError)}
            >
              <option value="">Select your campus</option>
              {campuses.map((campus) => (
                <option key={campus.id} value={campus.id}>
                  {campus.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="faculty" label="Faculty" error={facultyError}>
            <Select
              id="faculty"
              value={facultyId}
              disabled={!campusId}
              onChange={(event) => {
                setFacultyId(event.target.value);
                setProgramId("");
              }}
              invalid={Boolean(facultyError)}
              {...fieldAria("faculty", facultyError)}
            >
              <option value="">
                {campusId ? "Select your faculty" : "Choose a campus first"}
              </option>
              {campusFaculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field htmlFor="program" label="Study program" error={programError}>
            <Select
              id="program"
              value={programId}
              disabled={!facultyId}
              onChange={(event) => setProgramId(event.target.value)}
              invalid={Boolean(programError)}
              {...fieldAria("program", programError)}
            >
              <option value="">
                {facultyId ? "Select your program" : "Choose a faculty first"}
              </option>
              {facultyPrograms.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name}
                </option>
              ))}
            </Select>
          </Field>

          {campusId && facultyId && facultyPrograms.length === 0 ? (
            <Alert variant="info">
              No study programs are listed for this faculty yet.
            </Alert>
          ) : null}
        </section>
      ) : null}

      {step === 1 ? (
        <section className="flex flex-col gap-5">
          <header className="flex flex-col gap-1">
            <h2 className="text-h3 text-brand-950">Which semester are you in?</h2>
            <p className="text-body text-brand-800">
              This tunes your roadmap to where you are right now.
            </p>
          </header>

          <Field htmlFor="semester" label="Semester" error={semesterError}>
            <Select
              id="semester"
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
              invalid={Boolean(semesterError)}
              {...fieldAria("semester", semesterError)}
            >
              <option value="">Select your semester</option>
              {SEMESTERS.map((value) => (
                <option key={value} value={value}>
                  Semester {value}
                </option>
              ))}
            </Select>
          </Field>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="flex flex-col gap-6">
          <header className="flex flex-col gap-1">
            <h2 className="text-h3 text-brand-950">What do you want help with?</h2>
            <p className="text-body text-brand-800">
              Pick the area and the challenge that matter most. You can change
              this later in your profile.
            </p>
          </header>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-h5 text-brand-950">
              Adaptation area
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {ADAPTATION_AREAS.map((option) => (
                <ChoiceCard
                  key={option.value}
                  name="adaptationAreaChoice"
                  value={option.value}
                  title={option.label}
                  description={option.description}
                  checked={area === option.value}
                  onChange={() => setArea(option.value)}
                />
              ))}
            </div>
            {showErrors && !area ? (
              <p role="alert" className="text-caption text-red-700">
                Choose an adaptation area.
              </p>
            ) : null}
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="mb-1 text-h5 text-brand-950">Main challenge</legend>
            <div className="flex flex-wrap gap-2">
              {MAIN_CHALLENGES.map((option) => (
                <Chip
                  key={option.value}
                  selected={challenge === option.value}
                  onClick={() => setChallenge(option.value)}
                >
                  {option.label}
                </Chip>
              ))}
            </div>
            {showErrors && !challenge ? (
              <p role="alert" className="text-caption text-red-700">
                Choose your main challenge.
              </p>
            ) : null}
          </fieldset>
        </section>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button variant="ghost" onClick={goBack} disabled={pending}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back
          </Button>
        ) : (
          <span />
        )}

        {/* Distinct keys matter: without them React reuses one DOM button and
            flips its type to "submit" mid-click, which submits the form early. */}
        {step < STEPS.length - 1 ? (
          <Button key="continue" onClick={goNext}>
            Continue
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        ) : (
          <Button
            key="finish"
            type="submit"
            loading={pending}
            onClick={(event) => {
              if (!stepValid[2]) {
                event.preventDefault();
                setShowErrors(true);
              }
            }}
          >
            Finish
          </Button>
        )}
      </div>
    </form>
  );
}
