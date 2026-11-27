export const UGM_DEPARTMENTS = [
  "All UGM",
  "Teknologi Rekayasa Internet",
  "Teknik Informatika",
  "Sistem Informasi",
  "Teknik Elektro",
  "Teknik Industri",
  "Kedokteran",
  "Hukum",
  "Ekonomika dan Bisnis",
  "Other Departments",
] as const;

export type UgmDepartment = (typeof UGM_DEPARTMENTS)[number];

export const SOCIAL_POST_TYPES = [
  "discussion",
  "question",
  "information",
] as const;

export type SocialPostType = (typeof SOCIAL_POST_TYPES)[number];

export const COMMUNITY_VISIBILITIES = [
  "general",
  "university",
  "department",
] as const;

export type CommunityVisibility = (typeof COMMUNITY_VISIBILITIES)[number];

export const COMMUNITY_CATEGORIES = [
  "Academic & Study",
  "Tech & Engineering",
  "Career & Internship",
  "Scholarship",
  "Competition",
  "Campus Life & Orgs",
] as const;

export type CommunityIconKey =
  | "compass"
  | "code"
  | "briefcase"
  | "award"
  | "trophy"
  | "users"
  | "book";

export type SocialCommunity = {
  id: string;
  name: string;
  description: string;
  category: string;
  visibility: CommunityVisibility;
  university?: string;
  department?: string;
  icon: CommunityIconKey;
  memberCount: number;
  isJoined: boolean;
};

export type SocialReply = {
  id: string;
  postId: string;
  authorName: string;
  authorInitials: string;
  university: string;
  department: string;
  createdAtLabel: string;
  content: string;
  replyToAuthor?: string;
  likes: number;
  likedByViewer: boolean;
};

export type SocialPost = {
  id: string;
  scope: "general" | "university" | "department";
  university: string;
  department: string;
  authorName: string;
  authorInitials: string;
  isAnonymous?: boolean;
  createdAtLabel: string;
  postType: SocialPostType;
  content: string;
  communityId?: string;
  imagePlaceholder?: {
    label: string;
    caption: string;
  };
  likes: number;
  likedByViewer: boolean;
  replies: SocialReply[];
};

export type ViewerCommunityProfile = {
  displayName: string;
  universityName: string;
  universityShort: string;
  department: string;
};
