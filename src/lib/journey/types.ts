import type { AdaptationArea, MainChallenge } from "@/lib/constants/onboarding";
import type { GuideCategory } from "@/lib/knowledge/types";
import type { ChecklistStatus } from "@/types/database";

export type JourneyChecklistItem = {
  id: string;
  stageId: string;
  title: string;
};

export type JourneyStage = {
  id: string;
  order: number;
  title: string;
  items: readonly JourneyChecklistItem[];
};

export type JourneyInsight = {
  id: string;
  title: string;
  summary: string;
};

export type JourneyDefinition = {
  area: AdaptationArea;
  title: string;
  description: string;
  guideCategory: GuideCategory;
  reflectionPrompt: string;
  stages: readonly JourneyStage[];
  insights: readonly JourneyInsight[];
};

export type PersonalizedChecklistItem = JourneyChecklistItem & {
  status: ChecklistStatus;
  linkedTaskId: string | null;
  note: string;
};

export type PersonalizedStage = {
  id: string;
  order: number;
  title: string;
  isFocus: boolean;
  items: PersonalizedChecklistItem[];
  completedCount: number;
  skippedCount: number;
  totalCount: number;
};

export type JourneyProgressSummary = {
  completed: number;
  skipped: number;
  resolved: number;
  total: number;
  percentage: number;
};

export type PersonalizedJourney = {
  definition: JourneyDefinition;
  challenge: MainChallenge;
  challengeLabel: string;
  focusStageId: string;
  focusReason: string;
  stages: PersonalizedStage[];
  currentStage: PersonalizedStage;
  nextAction: PersonalizedChecklistItem | null;
  progress: JourneyProgressSummary;
  reflectionNote: string;
};
