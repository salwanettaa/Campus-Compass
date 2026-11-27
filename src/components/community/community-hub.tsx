"use client";

import { useMemo, useState } from "react";
import {
  Building2,
  Check,
  Globe,
  GraduationCap,
  Lock,
  Plus,
  Users,
  X,
} from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  MOCK_SOCIAL_COMMUNITIES,
  MOCK_SOCIAL_POSTS,
} from "@/lib/community/social-mock-data";
import {
  UGM_DEPARTMENTS,
  type SocialCommunity,
  type SocialPost,
  type SocialPostType,
  type ViewerCommunityProfile,
} from "@/lib/community/social-types";
import { cn } from "@/lib/utils";
import {
  COMMUNITY_ICONS,
  CreateCommunityModal,
} from "./create-community-modal";
import { PostComposer } from "./post-composer";
import { SocialPostCard } from "./social-post-card";
import { ThreadModal } from "./thread-modal";

type MainTab = "general" | "university" | "department" | "communities";

export function canAccessCommunity(
  community: SocialCommunity,
  viewer: ViewerCommunityProfile,
): boolean {
  if (community.visibility === "general") return true;
  if (community.visibility === "university") {
    return community.university === viewer.universityShort;
  }
  return (
    community.university === viewer.universityShort &&
    community.department === viewer.department
  );
}

export type CommunityHubProps = {
  viewer: ViewerCommunityProfile;
};

export function CommunityHub({ viewer }: CommunityHubProps) {
  const [activeTab, setActiveTab] = useState<MainTab>("general");
  const [selectedDepartment, setSelectedDepartment] =
    useState<string>("All UGM");
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(
    null,
  );

  const [posts, setPosts] = useState<SocialPost[]>(MOCK_SOCIAL_POSTS);
  const [communities, setCommunities] = useState<SocialCommunity[]>(
    MOCK_SOCIAL_COMMUNITIES,
  );

  const [openThreadPostId, setOpenThreadPostId] = useState<string | null>(null);
  const [createCommunityOpen, setCreateCommunityOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const isUgmMember = viewer.universityShort === "UGM";

  const accessibleCommunities = useMemo(
    () => communities.filter((c) => canAccessCommunity(c, viewer)),
    [communities, viewer],
  );

  const communityById = useMemo(() => {
    const map = new Map<string, SocialCommunity>();
    for (const c of accessibleCommunities) map.set(c.id, c);
    return map;
  }, [accessibleCommunities]);

  const joinedCommunities = useMemo(
    () => accessibleCommunities.filter((c) => c.isJoined),
    [accessibleCommunities],
  );

  const discoverCommunities = useMemo(
    () => accessibleCommunities.filter((c) => !c.isJoined),
    [accessibleCommunities],
  );

  const departmentCommunities = useMemo(
    () =>
      accessibleCommunities.filter(
        (c) =>
          c.visibility === "department" &&
          c.department === viewer.department,
      ),
    [accessibleCommunities, viewer.department],
  );

  const visiblePosts = useMemo(() => {
    if (selectedCommunityId) {
      const target = communityById.get(selectedCommunityId);
      if (!target) return [];
      return posts.filter((p) => p.communityId === selectedCommunityId);
    }

    if (activeTab === "general") {
      return posts.filter((p) => p.scope === "general");
    }

    if (activeTab === "university") {
      if (!isUgmMember) return [];
      const uniPosts = posts.filter(
        (p) =>
          p.university === viewer.universityShort &&
          (p.scope === "university" || p.scope === "department"),
      );
      if (selectedDepartment === "All UGM") {
        return uniPosts;
      }
      if (selectedDepartment === "Other Departments") {
        const coreDepts = new Set<string>(
          UGM_DEPARTMENTS.filter(
            (d) => d !== "All UGM" && d !== "Other Departments",
          ),
        );
        return uniPosts.filter((p) => !coreDepts.has(p.department));
      }
      return uniPosts.filter((p) => p.department === selectedDepartment);
    }

    if (activeTab === "department") {
      return posts.filter(
        (p) =>
          p.university === viewer.universityShort &&
          p.department === viewer.department,
      );
    }

    // My Communities tab feed: posts belonging to accessible joined communities
    const joinedIds = new Set(joinedCommunities.map((c) => c.id));
    return posts.filter((p) => p.communityId && joinedIds.has(p.communityId));
  }, [
    posts,
    activeTab,
    selectedDepartment,
    selectedCommunityId,
    isUgmMember,
    viewer.universityShort,
    viewer.department,
    joinedCommunities,
    communityById,
  ]);

  const activeThreadPost = useMemo(
    () => posts.find((p) => p.id === openThreadPostId) ?? null,
    [posts, openThreadPostId],
  );

  function handleCreatePost(payload: {
    content: string;
    postType: SocialPostType;
    communityId?: string;
    department: string;
    scope: "general" | "university" | "department";
    isAnonymous?: boolean;
  }) {
    const isAnon = Boolean(payload.isAnonymous);
    const initials =
      viewer.displayName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("") || "ST";

    const resolvedCommunityId =
      payload.communityId ||
      (activeTab === "communities" && joinedCommunities.length > 0
        ? joinedCommunities[0].id
        : undefined);

    const newPost: SocialPost = {
      id: `post-local-${Date.now()}`,
      scope: payload.scope,
      university: viewer.universityShort,
      department:
        payload.scope === "department" ? viewer.department : payload.department,
      authorName: isAnon ? "Anonymous Student" : viewer.displayName,
      authorInitials: isAnon ? "?" : initials,
      isAnonymous: isAnon,
      createdAtLabel: "just now",
      postType: payload.postType,
      content: payload.content,
      communityId: resolvedCommunityId,
      likes: 0,
      likedByViewer: false,
      replies: [],
    };

    setPosts((prev) => [newPost, ...prev]);
    if (activeTab === "communities" && !resolvedCommunityId) {
      setActiveTab("general");
    }
    setFeedback(
      isAnon
        ? "Your post is live in the feed (posted anonymously)."
        : "Your post is live in the feed.",
    );
  }

  function handleTogglePostLike(postId: string) {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const nextLiked = !post.likedByViewer;
        return {
          ...post,
          likedByViewer: nextLiked,
          likes: Math.max(0, post.likes + (nextLiked ? 1 : -1)),
        };
      }),
    );
  }

  function handleToggleReplyLike(postId: string, replyId: string) {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          replies: post.replies.map((reply) => {
            if (reply.id !== replyId) return reply;
            const nextLiked = !reply.likedByViewer;
            return {
              ...reply,
              likedByViewer: nextLiked,
              likes: Math.max(0, reply.likes + (nextLiked ? 1 : -1)),
            };
          }),
        };
      }),
    );
  }

  function handleSubmitReply(
    postId: string,
    content: string,
    replyToAuthor?: string,
    isAnonymous?: boolean,
  ) {
    const isAnon = Boolean(isAnonymous);
    const initials =
      viewer.displayName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? "")
        .join("") || "ST";

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          replies: [
            ...post.replies,
            {
              id: `rep-local-${Date.now()}`,
              postId,
              authorName: isAnon ? "Anonymous Student" : viewer.displayName,
              authorInitials: isAnon ? "?" : initials,
              isAnonymous: isAnon,
              university: viewer.universityShort,
              department: viewer.department,
              createdAtLabel: "just now",
              content,
              replyToAuthor,
              likes: 0,
              likedByViewer: false,
            },
          ],
        };
      }),
    );
  }

  function handleToggleJoinCommunity(communityId: string) {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id !== communityId) return c;
        if (!canAccessCommunity(c, viewer)) return c;
        const nextJoined = !c.isJoined;
        return {
          ...c,
          isJoined: nextJoined,
          memberCount: Math.max(1, c.memberCount + (nextJoined ? 1 : -1)),
        };
      }),
    );
  }

  function handleCreateCommunity(
    payload: Omit<SocialCommunity, "id" | "memberCount" | "isJoined">,
  ) {
    const newCommunity: SocialCommunity = {
      ...payload,
      id: `comm-local-${Date.now()}`,
      memberCount: 1,
      isJoined: true,
    };
    setCommunities((prev) => [newCommunity, ...prev]);
    if (canAccessCommunity(newCommunity, viewer)) {
      setSelectedCommunityId(newCommunity.id);
    }
    setActiveTab("communities");
    setFeedback(`Created community "${newCommunity.name}".`);
  }

  const activeCommunity = selectedCommunityId
    ? communityById.get(selectedCommunityId) ?? null
    : null;

  const composerScope: "general" | "university" | "department" =
    activeTab === "department"
      ? "department"
      : activeTab === "university"
        ? "university"
        : "general";

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Top Navigation & Create Community */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-300 pb-4">
        <nav
          aria-label="Community feeds"
          className="flex flex-wrap items-center gap-2"
        >
          <button
            type="button"
            aria-current={
              activeTab === "general" && !selectedCommunityId ? "page" : undefined
            }
            onClick={() => {
              setActiveTab("general");
              setSelectedCommunityId(null);
            }}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-h5 transition-colors",
              activeTab === "general" && !selectedCommunityId
                ? "border-brand-700 bg-fill text-white"
                : "border-brand-300 bg-paper-raised text-brand-800 hover:border-brand-600 hover:text-brand-950",
            )}
          >
            <Globe className="size-4" aria-hidden="true" />
            General
          </button>

          <button
            type="button"
            aria-current={
              activeTab === "university" && !selectedCommunityId
                ? "page"
                : undefined
            }
            onClick={() => {
              setActiveTab("university");
              setSelectedCommunityId(null);
            }}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-h5 transition-colors",
              activeTab === "university" && !selectedCommunityId
                ? "border-brand-700 bg-fill text-white"
                : "border-brand-300 bg-paper-raised text-brand-800 hover:border-brand-600 hover:text-brand-950",
            )}
          >
            <Building2 className="size-4" aria-hidden="true" />
            My University ({viewer.universityShort})
          </button>

          <button
            type="button"
            aria-current={
              activeTab === "department" && !selectedCommunityId
                ? "page"
                : undefined
            }
            onClick={() => {
              setActiveTab("department");
              setSelectedCommunityId(null);
            }}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-h5 transition-colors",
              activeTab === "department" && !selectedCommunityId
                ? "border-brand-700 bg-fill text-white"
                : "border-brand-300 bg-paper-raised text-brand-800 hover:border-brand-600 hover:text-brand-950",
            )}
          >
            <GraduationCap className="size-4" aria-hidden="true" />
            My Major
          </button>

          <button
            type="button"
            aria-current={
              activeTab === "communities" && !selectedCommunityId
                ? "page"
                : undefined
            }
            onClick={() => {
              setActiveTab("communities");
              setSelectedCommunityId(null);
            }}
            className={cn(
              "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-h5 transition-colors",
              activeTab === "communities" && !selectedCommunityId
                ? "border-brand-700 bg-fill text-white"
                : "border-brand-300 bg-paper-raised text-brand-800 hover:border-brand-600 hover:text-brand-950",
            )}
          >
            <Users className="size-4" aria-hidden="true" />
            My Communities ({joinedCommunities.length})
          </button>
        </nav>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setCreateCommunityOpen(true)}
        >
          <Plus className="size-4" aria-hidden="true" />
          Create Community
        </Button>
      </div>

      {feedback ? (
        <Alert variant="success" className="flex items-center justify-between">
          <span>{feedback}</span>
        </Alert>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        {/* Main Feed Column */}
        <div className="flex min-w-0 flex-col gap-5">
          {/* UGM Internal Access Guard */}
          {activeTab === "university" && !selectedCommunityId && !isUgmMember ? (
            <Alert variant="info" title="UGM Internal Feed">
              The UGM feed is restricted to verified UGM students. Switch to{" "}
              <strong>General</strong> or explore communities open to your
              university.
            </Alert>
          ) : null}

          {/* University Department Filter (ONLY for internal UGM feed) */}
          {activeTab === "university" && !selectedCommunityId && isUgmMember ? (
            <section
              aria-label="Department filter"
              className="flex flex-col gap-2.5 rounded-2xl border border-brand-300 bg-paper-raised p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Lock className="size-4 text-brand-700" aria-hidden="true" />
                  <p className="text-h5 text-brand-950">
                    {viewer.universityName} (Internal) · Major Filter
                  </p>
                </div>
                <span className="text-caption text-brand-800">
                  {visiblePosts.length}{" "}
                  {visiblePosts.length === 1 ? "post" : "posts"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {UGM_DEPARTMENTS.map((dept) => {
                  const selected = selectedDepartment === dept;
                  return (
                    <button
                      key={dept}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSelectedDepartment(dept)}
                      className={cn(
                        "inline-flex min-h-9 items-center rounded-full border px-3.5 text-caption transition-colors",
                        selected
                          ? "border-brand-700 bg-fill font-semibold text-white"
                          : "border-brand-300 bg-paper text-brand-800 hover:border-brand-600 hover:text-brand-950",
                      )}
                    >
                      {dept}
                    </button>
                  );
                })}
              </div>
            </section>
          ) : null}

          {/* My Department Exclusive Header */}
          {activeTab === "department" && !selectedCommunityId ? (
            <section
              aria-label="Department exclusive space"
              className="flex flex-col gap-3 rounded-2xl border border-brand-600 bg-paper-raised p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-caption font-medium text-brand-700">
                  <Lock className="size-3.5" aria-hidden="true" />
                  Major-Exclusive · {viewer.universityShort}
                </span>
                <span className="text-caption text-brand-800">
                  Only accessible to {viewer.department} students
                </span>
              </div>
              <h2 className="text-h3 text-brand-950">{viewer.department}</h2>
              {departmentCommunities.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {departmentCommunities.map((comm) => (
                    <button
                      key={comm.id}
                      type="button"
                      onClick={() => setSelectedCommunityId(comm.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 bg-paper px-3 py-1 text-caption text-brand-700 transition-colors hover:border-brand-600 hover:bg-brand-100"
                    >
                      {comm.name}
                    </button>
                  ))}
                </div>
              ) : null}
            </section>
          ) : null}

          {/* Selected Community Header */}
          {activeCommunity ? (
            <section className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-brand-600 bg-paper-raised p-5">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-0.5 text-caption text-brand-700">
                    {activeCommunity.visibility !== "general" ? (
                      <Lock className="size-3" aria-hidden="true" />
                    ) : null}
                    {activeCommunity.visibility === "general"
                      ? "General"
                      : activeCommunity.visibility === "university"
                        ? `${activeCommunity.university} Internal`
                        : `${activeCommunity.university} · ${activeCommunity.department} Only`}
                  </span>
                  <span className="text-caption text-brand-800">
                    {activeCommunity.memberCount} members
                  </span>
                </div>
                <h2 className="text-h3 text-brand-950">
                  {activeCommunity.name}
                </h2>
                <p className="text-body text-brand-800">
                  {activeCommunity.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={activeCommunity.isJoined ? "outline" : "primary"}
                  onClick={() => handleToggleJoinCommunity(activeCommunity.id)}
                >
                  {activeCommunity.isJoined ? "Joined" : "Join"}
                </Button>
                <button
                  type="button"
                  onClick={() => setSelectedCommunityId(null)}
                  aria-label="Clear community filter"
                  className="flex size-9 items-center justify-center rounded-full border border-brand-300 text-brand-800 hover:bg-brand-100 hover:text-brand-950"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>
            </section>
          ) : null}

          {/* Post Composer (hide if viewing restricted non-UGM My University tab) */}
          {!(activeTab === "university" && !selectedCommunityId && !isUgmMember) ? (
            <PostComposer
              viewer={viewer}
              communities={accessibleCommunities}
              activeScope={composerScope}
              defaultCommunityId={selectedCommunityId ?? ""}
              defaultDepartment={
                activeTab === "university" &&
                selectedDepartment !== "All UGM" &&
                selectedDepartment !== "Other Departments"
                  ? selectedDepartment
                  : viewer.department
              }
              onCreatePost={handleCreatePost}
            />
          ) : null}

          {/* My Communities Directory when on My Communities tab */}
          {activeTab === "communities" && !selectedCommunityId ? (
            <section
              aria-label="Your communities"
              className="flex flex-col gap-3 rounded-2xl border border-brand-300 bg-paper-raised p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-h4 text-brand-950">
                  Joined &amp; Created Communities
                </h2>
                <span className="text-caption text-brand-800">
                  Click any community to post or ask a question
                </span>
              </div>
              {joinedCommunities.length === 0 ? (
                <p className="text-body text-brand-800">
                  You haven&apos;t joined any communities yet. Explore communities
                  on the right or create your own!
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {joinedCommunities.map((comm) => {
                    const Icon = COMMUNITY_ICONS[comm.icon];
                    return (
                      <div
                        key={comm.id}
                        className="flex flex-col justify-between gap-3 rounded-xl border border-brand-300 bg-paper p-3.5"
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedCommunityId(comm.id)}
                          className="flex flex-col items-start gap-1 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <Icon
                              className="size-4 text-brand-700"
                              aria-hidden="true"
                            />
                            <span className="text-h5 text-brand-950 hover:underline">
                              {comm.name}
                            </span>
                            {comm.visibility !== "general" ? (
                              <Lock
                                className="size-3 text-brand-700"
                                aria-hidden="true"
                              />
                            ) : null}
                          </div>
                          <p className="text-caption line-clamp-2 text-brand-800">
                            {comm.description}
                          </p>
                        </button>
                        <div className="flex items-center justify-between">
                          <span className="text-caption text-brand-800">
                            {comm.memberCount} members
                          </span>
                          <button
                            type="button"
                            onClick={() => handleToggleJoinCommunity(comm.id)}
                            className="text-caption text-brand-700 hover:underline"
                          >
                            Leave
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          ) : null}

          {/* Feed Stream */}
          {visiblePosts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-brand-300 bg-paper-raised p-8 text-center">
              <p className="text-h4 text-brand-950">No posts here yet</p>
              <p className="text-body mt-1 text-brand-800">
                Be the first to start a discussion or ask a question!
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4" aria-label="Community feed">
              {visiblePosts.map((post) => (
                <li key={post.id}>
                  <SocialPostCard
                    post={post}
                    community={
                      post.communityId
                        ? communityById.get(post.communityId)
                        : undefined
                    }
                    onToggleLike={handleTogglePostLike}
                    onOpenThread={(id) => setOpenThreadPostId(id)}
                    onSelectCommunity={(id) => setSelectedCommunityId(id)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right Sidebar: Discover Communities */}
        <aside
          aria-label="Communities directory"
          className="flex flex-col gap-5 lg:sticky lg:top-6"
        >
          <section className="flex flex-col gap-4 rounded-2xl border border-brand-300 bg-paper-raised p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-h4 text-brand-950">Discover Communities</h2>
              <span className="text-caption text-brand-800">
                {accessibleCommunities.length}
              </span>
            </div>

            <ul className="flex flex-col gap-3">
              {(discoverCommunities.length > 0
                ? discoverCommunities
                : accessibleCommunities
              ).map((comm) => {
                const Icon = COMMUNITY_ICONS[comm.icon];
                return (
                  <li
                    key={comm.id}
                    className="flex flex-col gap-2 rounded-xl border border-brand-300 bg-paper p-3.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCommunityId(comm.id)}
                        className="flex min-w-0 items-center gap-2 text-left"
                      >
                        <Icon
                          className="size-4 shrink-0 text-brand-700"
                          aria-hidden="true"
                        />
                        <span className="text-h5 truncate text-brand-950 hover:underline">
                          {comm.name}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleJoinCommunity(comm.id)}
                        className={cn(
                          "inline-flex min-h-7 shrink-0 items-center gap-1 rounded-full border px-2.5 text-caption transition-colors",
                          comm.isJoined
                            ? "border-brand-600 bg-brand-100 text-brand-950"
                            : "border-brand-400 bg-paper-raised text-brand-950 hover:border-brand-700",
                        )}
                      >
                        {comm.isJoined ? (
                          <>
                            <Check className="size-3" aria-hidden="true" />
                            Joined
                          </>
                        ) : (
                          "Join"
                        )}
                      </button>
                    </div>
                    <p className="text-caption line-clamp-2 text-brand-800">
                      {comm.description}
                    </p>
                    <div className="flex items-center justify-between text-caption text-brand-800">
                      <span className="inline-flex items-center gap-1">
                        {comm.visibility !== "general" ? (
                          <Lock className="size-3" aria-hidden="true" />
                        ) : null}
                        {comm.visibility === "general"
                          ? "General"
                          : comm.visibility === "university"
                            ? `${comm.university} Internal`
                            : `${comm.department}`}
                      </span>
                      <span>{comm.memberCount} members</span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={() => setCreateCommunityOpen(true)}
            >
              <Plus className="size-4" aria-hidden="true" />
              Create Community
            </Button>
          </section>
        </aside>
      </div>

      {/* Thread Modal */}
      <ThreadModal
        post={activeThreadPost}
        community={
          activeThreadPost?.communityId
            ? communityById.get(activeThreadPost.communityId)
            : undefined
        }
        viewer={viewer}
        onClose={() => setOpenThreadPostId(null)}
        onTogglePostLike={handleTogglePostLike}
        onToggleReplyLike={handleToggleReplyLike}
        onSubmitReply={handleSubmitReply}
      />

      {/* Create Community Modal */}
      <CreateCommunityModal
        open={createCommunityOpen}
        viewer={viewer}
        onClose={() => setCreateCommunityOpen(false)}
        onCreate={handleCreateCommunity}
      />
    </div>
  );
}
