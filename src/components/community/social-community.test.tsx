import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CommunityHub, canAccessCommunity } from "./community-hub";
import { SocialPostCard } from "./social-post-card";
import { ThreadModal } from "./thread-modal";
import {
  MOCK_SOCIAL_COMMUNITIES,
  MOCK_SOCIAL_POSTS,
} from "@/lib/community/social-mock-data";

const ugmTriViewer = {
  displayName: "Kalya",
  universityName: "Universitas Gadjah Mada",
  universityShort: "UGM",
  department: "Teknologi Rekayasa Internet",
};

const itbViewer = {
  displayName: "Salsa",
  universityName: "Institut Teknologi Bandung",
  universityShort: "ITB",
  department: "Teknik Informatika",
};

describe("Social Community prototype", () => {
  it("renders CommunityHub with General, My University, My Major, My Communities, and Create Community", () => {
    const html = renderToStaticMarkup(<CommunityHub viewer={ugmTriViewer} />);
    expect(html).toContain("General");
    expect(html).toContain("My University (UGM)");
    expect(html).toContain("My Major");
    expect(html).toContain("My Communities");
    expect(html).toContain("Create Community");
    expect(html).toContain("Discover Communities");
  });

  it("enforces UGM internal and department-exclusive community access", () => {
    const ugmComm = MOCK_SOCIAL_COMMUNITIES.find(
      (c) => c.visibility === "university",
    )!;
    const triComm = MOCK_SOCIAL_COMMUNITIES.find(
      (c) => c.department === "Teknologi Rekayasa Internet",
    )!;
    const ifUgmComm = MOCK_SOCIAL_COMMUNITIES.find(
      (c) => c.department === "Teknik Informatika",
    )!;
    const generalComm = MOCK_SOCIAL_COMMUNITIES.find(
      (c) => c.visibility === "general",
    )!;

    expect(canAccessCommunity(generalComm, ugmTriViewer)).toBe(true);
    expect(canAccessCommunity(generalComm, itbViewer)).toBe(true);

    expect(canAccessCommunity(ugmComm, ugmTriViewer)).toBe(true);
    expect(canAccessCommunity(ugmComm, itbViewer)).toBe(false);

    expect(canAccessCommunity(triComm, ugmTriViewer)).toBe(true);
    expect(canAccessCommunity(ifUgmComm, ugmTriViewer)).toBe(false);
    expect(canAccessCommunity(ifUgmComm, itbViewer)).toBe(false);
  });

  it("renders SocialPostCard with Question distinction and university/department info", () => {
    const questionPost = MOCK_SOCIAL_POSTS.find(
      (p) => p.postType === "question",
    )!;
    const html = renderToStaticMarkup(
      <SocialPostCard
        post={questionPost}
        onToggleLike={() => {}}
        onOpenThread={() => {}}
      />,
    );
    expect(html).toContain("Question");
    expect(html).toContain(questionPost.university);
    expect(html).toContain(questionPost.department);
    expect(html).toContain(questionPost.authorName);
  });

  it("renders anonymous badge and masked author info on anonymous posts", () => {
    const anonPost = MOCK_SOCIAL_POSTS.find((p) => p.isAnonymous)!;
    const html = renderToStaticMarkup(
      <SocialPostCard
        post={anonPost}
        onToggleLike={() => {}}
        onOpenThread={() => {}}
      />,
    );
    expect(html).toContain("Anonymous Student");
    expect(html).toContain("Anonymous");
  });

  it("renders ThreadModal with Reply as Anonymous toggle and displays masked replies", () => {
    const postWithReplies = {
      ...MOCK_SOCIAL_POSTS[0],
      replies: [
        {
          id: "rep-anon-test",
          postId: MOCK_SOCIAL_POSTS[0].id,
          authorName: "Anonymous Student",
          authorInitials: "?",
          isAnonymous: true,
          university: "UGM",
          department: "Teknologi Rekayasa Internet",
          createdAtLabel: "10m",
          content: "You can ask the prodi admin directly for syllabus approval.",
          likes: 2,
          likedByViewer: false,
        },
      ],
    };

    const html = renderToStaticMarkup(
      <ThreadModal
        post={postWithReplies}
        viewer={ugmTriViewer}
        onClose={() => {}}
        onTogglePostLike={() => {}}
        onToggleReplyLike={() => {}}
        onSubmitReply={() => {}}
      />,
    );

    expect(html).toContain("Reply as Anonymous");
    expect(html).toContain("Replying as Kalya");
    expect(html).toContain("Anonymous Student");
  });
});
