import {
  MAIN_CHALLENGES,
  type AdaptationArea,
  type MainChallenge,
} from "@/lib/constants/onboarding";
import type { ChecklistStatus } from "@/types/database";
import type {
  JourneyDefinition,
  PersonalizedChecklistItem,
  PersonalizedJourney,
  PersonalizedStage,
} from "./types";

function item(stageId: string, index: number, title: string) {
  return {
    id: `${stageId}_item_${index}`,
    stageId,
    title,
  };
}

export const JOURNEYS: Record<AdaptationArea, JourneyDefinition> = {
  social: {
    area: "social",
    title: "Find Your Community",
    description:
      "Explore organizations and communities that match your interests.",
    guideCategory: "social_community",
    reflectionPrompt:
      "What did you learn from exploring communities this week, and what feels like the right next step?",
    stages: [
      {
        id: "social_stage_1",
        order: 1,
        title: "Discover Your Interests",
        items: [
          item("social_stage_1", 1, "Identify your interests and hobbies."),
          item(
            "social_stage_1",
            2,
            "Determine what type of organization or community you want to join.",
          ),
          item(
            "social_stage_1",
            3,
            "Explore available student organizations and communities.",
          ),
        ],
      },
      {
        id: "social_stage_2",
        order: 2,
        title: "Explore Organizations & Communities",
        items: [
          item(
            "social_stage_2",
            1,
            "Find at least 3 relevant organizations or communities.",
          ),
          item(
            "social_stage_2",
            2,
            "Learn about their activities and programs.",
          ),
          item(
            "social_stage_2",
            3,
            "Check their membership requirements and registration periods.",
          ),
        ],
      },
      {
        id: "social_stage_3",
        order: 3,
        title: "Take Your First Step",
        items: [
          item(
            "social_stage_3",
            1,
            "Explore upcoming events or open house activities.",
          ),
          item(
            "social_stage_3",
            2,
            "Contact an organization or community member.",
          ),
          item(
            "social_stage_3",
            3,
            "Attend at least one activity or meeting.",
          ),
        ],
      },
      {
        id: "social_stage_4",
        order: 4,
        title: "Build Your Connection",
        items: [
          item("social_stage_4", 1, "Reflect on your experience."),
          item(
            "social_stage_4",
            2,
            "Evaluate whether the community matches your interests.",
          ),
          item(
            "social_stage_4",
            3,
            "Decide whether to join, continue participating, or explore another community.",
          ),
        ],
      },
    ],
    insights: [
      {
        id: "social_insight_1",
        title:
          "Differences between student organizations, student clubs, communities, and committees",
        summary:
          "Student organizations (BEM/Himpunan) focus on governance and advocacy, clubs (UKM) focus on hobbies or skills, communities are informal peer groups, and committees are short-term event teams.",
      },
      {
        id: "social_insight_2",
        title:
          "How to choose an organization that matches your interests and available time",
        summary:
          "Start with one commitment you can realistically sustain alongside classes. Check weekly meeting hours before signing up for multiple groups.",
      },
      {
        id: "social_insight_3",
        title:
          "Tips for joining a new community and overcoming social awkwardness",
        summary:
          "Attend open-house sessions with a clear question to ask, introduce yourself to one or two people early, and remember most newcomers feel the same way.",
      },
      {
        id: "social_insight_4",
        title:
          "Experiences and advice from senior students about joining organizations",
        summary:
          "Browse Community Q&A and Knowledge Hub experiences to see how seniors balanced their first organization with semester coursework.",
      },
      {
        id: "social_insight_5",
        title:
          "How to balance organizational activities with academic responsibilities",
        summary:
          "Block exam weeks and assignment deadlines on your calendar first, and communicate early with your team when academic workload peaks.",
      },
    ],
  },
  academic: {
    area: "academic",
    title: "Build Your Academic Foundation",
    description:
      "Understand your academic system, develop effective learning methods, and manage your academic workload.",
    guideCategory: "academic_survival",
    reflectionPrompt:
      "Which study method or routine worked best for you recently, and what needs adjustment next week?",
    stages: [
      {
        id: "academic_stage_1",
        order: 1,
        title: "Understand Your Academic System",
        items: [
          item(
            "academic_stage_1",
            1,
            "Learn about the academic grading system and regulations.",
          ),
          item(
            "academic_stage_1",
            2,
            "Understand the academic calendar and course schedule.",
          ),
          item(
            "academic_stage_1",
            3,
            "Identify courses that require additional attention.",
          ),
        ],
      },
      {
        id: "academic_stage_2",
        order: 2,
        title: "Find Your Learning Method",
        items: [
          item("academic_stage_2", 1, "Identify your current learning habits."),
          item("academic_stage_2", 2, "Explore different study methods."),
          item("academic_stage_2", 3, "Try at least one new learning method."),
          item(
            "academic_stage_2",
            4,
            "Find additional learning resources for difficult courses.",
          ),
        ],
      },
      {
        id: "academic_stage_3",
        order: 3,
        title: "Manage Your Academic Workload",
        items: [
          item(
            "academic_stage_3",
            1,
            "List assignments, exams, and deadlines.",
          ),
          item("academic_stage_3", 2, "Create a weekly study schedule."),
          item(
            "academic_stage_3",
            3,
            "Prioritize tasks based on deadlines and difficulty.",
          ),
        ],
      },
      {
        id: "academic_stage_4",
        order: 4,
        title: "Evaluate Your Progress",
        items: [
          item(
            "academic_stage_4",
            1,
            "Evaluate the effectiveness of your learning methods.",
          ),
          item(
            "academic_stage_4",
            2,
            "Identify academic challenges that remain.",
          ),
          item(
            "academic_stage_4",
            3,
            "Adjust your study strategy for the next week.",
          ),
        ],
      },
    ],
    insights: [
      {
        id: "academic_insight_1",
        title: "Understanding SKS, academic grading, and academic regulations",
        summary:
          "Each SKS represents weekly lecture, structured assignment, and independent study hours. Review your faculty handbook for attendance and grade weight rules.",
      },
      {
        id: "academic_insight_2",
        title: "Active recall, spaced repetition, and other learning techniques",
        summary:
          "Testing yourself without notes (active recall) and reviewing material across spaced intervals outperforms passive rereading.",
      },
      {
        id: "academic_insight_3",
        title: "How to prepare for exams and assignments",
        summary:
          "Break major deliverables into smaller milestones two weeks ahead, and practice with past exam questions under timed conditions.",
      },
      {
        id: "academic_insight_4",
        title: "How to manage group assignments",
        summary:
          "Agree on deliverables, internal deadlines, and communication channels during your first meeting so work stays balanced.",
      },
      {
        id: "academic_insight_5",
        title:
          "How to ask lecturers, teaching assistants, or classmates for academic help",
        summary:
          "Bring specific questions and show what you already tried when emailing lecturers or visiting office hours.",
      },
      {
        id: "academic_insight_6",
        title: "How to identify and improve ineffective study habits",
        summary:
          "If you spend hours reading without retaining concepts, switch to summarizing from memory or solving practice problems.",
      },
    ],
  },
  internship: {
    area: "internship",
    title: "Prepare for Your First Internship",
    description:
      "Explore career interests, prepare your professional profile, and apply for internship opportunities.",
    guideCategory: "career_preparation",
    reflectionPrompt:
      "What progress did you make toward internship readiness, and which skill or application step is next?",
    stages: [
      {
        id: "internship_stage_1",
        order: 1,
        title: "Explore Career Interests",
        items: [
          item(
            "internship_stage_1",
            1,
            "Identify career fields that interest you.",
          ),
          item(
            "internship_stage_1",
            2,
            "Explore internship roles related to your interests.",
          ),
          item(
            "internship_stage_1",
            3,
            "Learn about the skills required for those roles.",
          ),
        ],
      },
      {
        id: "internship_stage_2",
        order: 2,
        title: "Assess Your Readiness",
        items: [
          item(
            "internship_stage_2",
            1,
            "Identify your existing skills and experiences.",
          ),
          item(
            "internship_stage_2",
            2,
            "Identify skills that need improvement.",
          ),
          item(
            "internship_stage_2",
            3,
            "Select projects or experiences that can strengthen your application.",
          ),
        ],
      },
      {
        id: "internship_stage_3",
        order: 3,
        title: "Prepare Your Application",
        items: [
          item("internship_stage_3", 1, "Create or update your CV."),
          item(
            "internship_stage_3",
            2,
            "Prepare a portfolio or project documentation.",
          ),
          item("internship_stage_3", 3, "Update your professional profile."),
          item(
            "internship_stage_3",
            4,
            "Prepare an application email or cover letter.",
          ),
        ],
      },
      {
        id: "internship_stage_4",
        order: 4,
        title: "Find and Apply",
        items: [
          item(
            "internship_stage_4",
            1,
            "Find suitable internship opportunities.",
          ),
          item(
            "internship_stage_4",
            2,
            "Check eligibility requirements and deadlines.",
          ),
          item(
            "internship_stage_4",
            3,
            "Customize your application for each position.",
          ),
          item(
            "internship_stage_4",
            4,
            "Track application status and selection schedules.",
          ),
        ],
      },
      {
        id: "internship_stage_5",
        order: 5,
        title: "Prepare for the Selection Process",
        items: [
          item(
            "internship_stage_5",
            1,
            "Research the company and internship role.",
          ),
          item("internship_stage_5", 2, "Practice interview questions."),
          item(
            "internship_stage_5",
            3,
            "Prepare to explain your projects and experiences.",
          ),
          item(
            "internship_stage_5",
            4,
            "Evaluate selection results and determine your next steps.",
          ),
        ],
      },
    ],
    insights: [
      {
        id: "internship_insight_1",
        title: "How to create a CV without formal work experience",
        summary:
          "Highlight coursework projects, organization committees, volunteer work, and measurable outcomes instead of leaving sections blank.",
      },
      {
        id: "internship_insight_2",
        title: "How to find internship opportunities",
        summary:
          "Combine campus career centers, official company career pages, and referrals from alumni or seniors.",
      },
      {
        id: "internship_insight_3",
        title: "How to write a professional application email or cold email",
        summary:
          "Use a clear subject line, state the role you are targeting, summarize two relevant strengths, and attach a tailored CV.",
      },
      {
        id: "internship_insight_4",
        title: "How to prepare for internship interviews",
        summary:
          "Prepare structured STAR stories (Situation, Task, Action, Result) for teamwork, problem-solving, and learning from mistakes.",
      },
      {
        id: "internship_insight_5",
        title: "How to explain academic and personal projects",
        summary:
          "Focus on the problem you solved, your specific contribution, the tools used, and what you would improve next.",
      },
      {
        id: "internship_insight_6",
        title: "How to build a portfolio",
        summary:
          "Select 2 to 3 clear projects with context, screenshots or code links, and concise explanations of your decisions.",
      },
      {
        id: "internship_insight_7",
        title: "How to improve your application after receiving a rejection",
        summary:
          "Review which stage filtered you out (CV screening vs. interview) and refine that specific part before your next batch of applications.",
      },
    ],
  },
  scholarship: {
    area: "scholarship",
    title: "Your Scholarship Journey",
    description:
      "Discover suitable scholarships, understand eligibility requirements, and prepare scholarship applications.",
    guideCategory: "scholarship_growth",
    reflectionPrompt:
      "Which scholarship requirement or essay draft moved forward, and what document needs attention next?",
    stages: [
      {
        id: "scholarship_stage_1",
        order: 1,
        title: "Understand Your Scholarship Goals",
        items: [
          item(
            "scholarship_stage_1",
            1,
            "Identify why you want to apply for a scholarship.",
          ),
          item(
            "scholarship_stage_1",
            2,
            "Determine the types of scholarships you are interested in.",
          ),
          item(
            "scholarship_stage_1",
            3,
            "Identify scholarship criteria that match your circumstances.",
          ),
        ],
      },
      {
        id: "scholarship_stage_2",
        order: 2,
        title: "Discover Suitable Scholarships",
        items: [
          item(
            "scholarship_stage_2",
            1,
            "Search for scholarships based on your academic level and needs.",
          ),
          item(
            "scholarship_stage_2",
            2,
            "Review academic and non-academic eligibility requirements.",
          ),
          item(
            "scholarship_stage_2",
            3,
            "Check application deadlines and registration periods.",
          ),
        ],
      },
      {
        id: "scholarship_stage_3",
        order: 3,
        title: "Prepare Your Documents",
        items: [
          item(
            "scholarship_stage_3",
            1,
            "Prepare academic records or transcripts.",
          ),
          item(
            "scholarship_stage_3",
            2,
            "Prepare your CV and achievement records.",
          ),
          item(
            "scholarship_stage_3",
            3,
            "Identify whether recommendation letters are required.",
          ),
          item(
            "scholarship_stage_3",
            4,
            "Prepare additional documents based on scholarship requirements.",
          ),
        ],
      },
      {
        id: "scholarship_stage_4",
        order: 4,
        title: "Build Your Application",
        items: [
          item(
            "scholarship_stage_4",
            1,
            "Draft your personal statement or scholarship essay.",
          ),
          item(
            "scholarship_stage_4",
            2,
            "Explain your educational goals and future plans.",
          ),
          item(
            "scholarship_stage_4",
            3,
            "Request feedback on your application materials.",
          ),
          item("scholarship_stage_4", 4, "Review all application requirements."),
        ],
      },
      {
        id: "scholarship_stage_5",
        order: 5,
        title: "Submit and Follow Up",
        items: [
          item(
            "scholarship_stage_5",
            1,
            "Submit your application before the deadline.",
          ),
          item("scholarship_stage_5", 2, "Save proof of submission."),
          item(
            "scholarship_stage_5",
            3,
            "Track announcement dates and selection schedules.",
          ),
          item(
            "scholarship_stage_5",
            4,
            "Evaluate the results and identify other opportunities.",
          ),
        ],
      },
    ],
    insights: [
      {
        id: "scholarship_insight_1",
        title:
          "Different types of scholarships and their eligibility requirements",
        summary:
          "Scholarships vary across merit-based, need-based, government, corporate, and campus-specific programs—check semester and GPA rules carefully.",
      },
      {
        id: "scholarship_insight_2",
        title:
          "How to find scholarships that match your academic level and background",
        summary:
          "Check your university student affairs portal and faculty announcements regularly for programs open to your semester.",
      },
      {
        id: "scholarship_insight_3",
        title: "How to write a personal statement",
        summary:
          "Connect your past experiences, current academic focus, and future impact into one coherent narrative tailored to the sponsor's mission.",
      },
      {
        id: "scholarship_insight_4",
        title: "How to request recommendation letters",
        summary:
          "Ask lecturers or mentors at least two weeks early, and share your CV, transcript, and scholarship details to help them write specifics.",
      },
      {
        id: "scholarship_insight_5",
        title: "How to prepare for scholarship interviews",
        summary:
          "Be ready to discuss your study plan, community involvement, and how the scholarship supports your goals.",
      },
      {
        id: "scholarship_insight_6",
        title: "Common mistakes in scholarship applications",
        summary:
          "Missing file formats, generic essays that ignore the prompt, and submitting near the deadline are the most frequent pitfalls.",
      },
      {
        id: "scholarship_insight_7",
        title:
          "How to prepare scholarship documents before application periods open",
        summary:
          "Keep an updated CV, digital copies of certificates, and an up-to-date transcript ready in one folder.",
      },
    ],
  },
  competition: {
    area: "competition",
    title: "Get Ready to Compete",
    description:
      "Find suitable competitions, prepare your team or project, and complete competition submissions.",
    guideCategory: "scholarship_growth",
    reflectionPrompt:
      "How is your competition idea or team progressing, and what milestone do you want to finish next?",
    stages: [
      {
        id: "competition_stage_1",
        order: 1,
        title: "Discover Your Competition Interests",
        items: [
          item(
            "competition_stage_1",
            1,
            "Identify competition fields that interest you.",
          ),
          item(
            "competition_stage_1",
            2,
            "Determine whether you prefer individual or team competitions.",
          ),
          item(
            "competition_stage_1",
            3,
            "Explore competition levels that match your experience.",
          ),
        ],
      },
      {
        id: "competition_stage_2",
        order: 2,
        title: "Find the Right Competition",
        items: [
          item(
            "competition_stage_2",
            1,
            "Find competitions related to your interests.",
          ),
          item("competition_stage_2", 2, "Check eligibility requirements."),
          item(
            "competition_stage_2",
            3,
            "Review the competition theme, format, and judging criteria.",
          ),
          item(
            "competition_stage_2",
            4,
            "Record registration and submission deadlines.",
          ),
        ],
      },
      {
        id: "competition_stage_3",
        order: 3,
        title: "Prepare Your Team and Idea",
        items: [
          item("competition_stage_3", 1, "Form a team if required."),
          item(
            "competition_stage_3",
            2,
            "Determine team roles and responsibilities.",
          ),
          item("competition_stage_3", 3, "Select an idea or project topic."),
          item(
            "competition_stage_3",
            4,
            "Create a project timeline based on the competition deadline.",
          ),
        ],
      },
      {
        id: "competition_stage_4",
        order: 4,
        title: "Develop Your Submission",
        items: [
          item("competition_stage_4", 1, "Develop your project or solution."),
          item(
            "competition_stage_4",
            2,
            "Prepare the required proposal, report, or presentation.",
          ),
          item(
            "competition_stage_4",
            3,
            "Evaluate your submission against the judging criteria.",
          ),
          item("competition_stage_4", 4, "Revise your work before submission."),
        ],
      },
      {
        id: "competition_stage_5",
        order: 5,
        title: "Submit and Reflect",
        items: [
          item(
            "competition_stage_5",
            1,
            "Submit your work before the deadline.",
          ),
          item("competition_stage_5", 2, "Save proof of submission."),
          item(
            "competition_stage_5",
            3,
            "Prepare for presentations or final rounds if required.",
          ),
          item(
            "competition_stage_5",
            4,
            "Reflect on your experience and identify lessons learned.",
          ),
        ],
      },
    ],
    insights: [
      {
        id: "competition_insight_1",
        title: "How to choose competitions suitable for beginners",
        summary:
          "Start with campus-level or themed beginner tracks where clear rubrics and mentorship help you learn the format.",
      },
      {
        id: "competition_insight_2",
        title: "How to find teammates",
        summary:
          "Look across complementary skills (research, design, technical, pitching) in your classes, clubs, or Community discussions.",
      },
      {
        id: "competition_insight_3",
        title: "How to develop competition ideas",
        summary:
          "Start from a real, well-defined problem aligned with the competition theme before jumping to a solution.",
      },
      {
        id: "competition_insight_4",
        title: "How to write competition proposals",
        summary:
          "Mirror the judging rubric headings directly so reviewers can easily score your problem statement, methodology, and impact.",
      },
      {
        id: "competition_insight_5",
        title: "How to create pitch decks and presentations",
        summary:
          "Keep slides visual and concise: one key message per slide, clear problem-solution flow, and rehearsed timing.",
      },
      {
        id: "competition_insight_6",
        title: "How to manage competition projects and deadlines",
        summary:
          "Work backward from the submission date and lock a buffer of 2 to 3 days for revisions and formatting.",
      },
      {
        id: "competition_insight_7",
        title:
          "How to evaluate competition experiences and improve future submissions",
        summary:
          "Save judge feedback and review winning entries to spot gaps in feasibility, storytelling, or evidence.",
      },
    ],
  },
};

const CHALLENGE_FOCUS_STAGE: Record<
  MainChallenge,
  { stageId: string; reason: string }
> = {
  // Social
  finding_friends: {
    stageId: "social_stage_3",
    reason:
      "Prioritizing taking your first step into events and connecting with peers.",
  },
  joining_organizations: {
    stageId: "social_stage_2",
    reason:
      "Prioritizing finding and evaluating student organizations to join.",
  },
  finding_communities: {
    stageId: "social_stage_2",
    reason:
      "Prioritizing discovering communities and attending their activities.",
  },
  // Academic
  study_methods: {
    stageId: "academic_stage_2",
    reason:
      "Prioritizing exploring learning methods and evaluating their effectiveness.",
  },
  understanding_academic_systems: {
    stageId: "academic_stage_1",
    reason:
      "Prioritizing understanding grading rules, SKS, and academic schedules.",
  },
  time_management_academic: {
    stageId: "academic_stage_3",
    reason:
      "Prioritizing organizing assignments, deadlines, and a weekly study routine.",
  },
  // Internship
  career_exploration: {
    stageId: "internship_stage_1",
    reason:
      "Prioritizing exploring career fields, internship roles, and required skills.",
  },
  finding_internship_opportunities: {
    stageId: "internship_stage_4",
    reason:
      "Prioritizing finding suitable internship openings and tracking deadlines.",
  },
  application_preparation: {
    stageId: "internship_stage_3",
    reason:
      "Prioritizing building your CV, portfolio, and application materials.",
  },
  interview_preparation: {
    stageId: "internship_stage_5",
    reason:
      "Prioritizing interview practice and explaining your projects clearly.",
  },
  // Scholarship
  finding_suitable_scholarships: {
    stageId: "scholarship_stage_2",
    reason:
      "Prioritizing discovering scholarships that match your level and needs.",
  },
  understanding_eligibility: {
    stageId: "scholarship_stage_1",
    reason:
      "Prioritizing clarifying your goals and matching eligibility criteria.",
  },
  preparing_application_documents: {
    stageId: "scholarship_stage_3",
    reason:
      "Prioritizing gathering transcripts, CV, and recommendation letters.",
  },
  scholarship_application_preparation: {
    stageId: "scholarship_stage_4",
    reason:
      "Prioritizing drafting your personal statement and reviewing requirements.",
  },
  // Competition
  finding_suitable_competitions: {
    stageId: "competition_stage_2",
    reason:
      "Prioritizing finding competitions that match your interests and judging criteria.",
  },
  finding_teammates: {
    stageId: "competition_stage_3",
    reason:
      "Prioritizing team formation, role distribution, and picking your idea.",
  },
  developing_ideas_projects: {
    stageId: "competition_stage_3",
    reason:
      "Prioritizing shaping a strong project idea and realistic timeline.",
  },
  preparing_competition_submissions: {
    stageId: "competition_stage_4",
    reason:
      "Prioritizing developing your deliverable and reviewing it against judging criteria.",
  },
};

export function findChecklistItemMeta(checklistItemId: string) {
  for (const definition of Object.values(JOURNEYS)) {
    for (const stage of definition.stages) {
      const found = stage.items.find((entry) => entry.id === checklistItemId);
      if (found) {
        return {
          area: definition.area,
          stage,
          item: found,
        };
      }
    }
  }
  return null;
}

export function personalizeJourney(
  area: AdaptationArea,
  challenge: MainChallenge,
  statusByItemId: Record<string, ChecklistStatus>,
  linkedTaskIdByItemId: Record<string, string>,
  reflectionNote = "",
  noteByItemId: Record<string, string> = {},
): PersonalizedJourney {
  const definition = JOURNEYS[area];
  const focus = CHALLENGE_FOCUS_STAGE[challenge];
  const challengeLabel =
    MAIN_CHALLENGES.find((c) => c.value === challenge)?.label ?? challenge;

  let completed = 0;
  let skipped = 0;
  let total = 0;

  const stages: PersonalizedStage[] = definition.stages.map((stage) => {
    let stageCompleted = 0;
    let stageSkipped = 0;

    const items: PersonalizedChecklistItem[] = stage.items.map((entry) => {
      const status = statusByItemId[entry.id] ?? "pending";
      total += 1;
      if (status === "completed") {
        completed += 1;
        stageCompleted += 1;
      } else if (status === "skipped") {
        skipped += 1;
        stageSkipped += 1;
      }
      return {
        ...entry,
        status,
        linkedTaskId: linkedTaskIdByItemId[entry.id] ?? null,
        note: noteByItemId[entry.id] ?? "",
      };
    });

    return {
      id: stage.id,
      order: stage.order,
      title: stage.title,
      isFocus: stage.id === focus.stageId,
      items,
      completedCount: stageCompleted,
      skippedCount: stageSkipped,
      totalCount: items.length,
    };
  });

  const resolved = completed + skipped;
  const percentage = total > 0 ? Math.round((resolved / total) * 100) : 0;

  const focusStageWithPending = stages.find(
    (s) => s.isFocus && s.items.some((i) => i.status === "pending"),
  );
  const firstStageWithPending = stages.find((s) =>
    s.items.some((i) => i.status === "pending"),
  );
  const currentStage =
    focusStageWithPending ??
    firstStageWithPending ??
    stages.find((s) => s.isFocus) ??
    stages[0];

  const nextAction =
    currentStage.items.find((i) => i.status === "pending") ??
    firstStageWithPending?.items.find((i) => i.status === "pending") ??
    null;

  return {
    definition,
    challenge,
    challengeLabel,
    focusStageId: focus.stageId,
    focusReason: focus.reason,
    stages,
    currentStage,
    nextAction,
    progress: {
      completed,
      skipped,
      resolved,
      total,
      percentage,
    },
    reflectionNote,
  };
}
