import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CommentThread } from "./comment-thread";
import { HelpfulButton } from "./helpful-button";
import { PostCard } from "./post-card";
import { MOCK_COMMENTS, MOCK_POSTS } from "@/lib/community/mock-data";

describe("community components (server render)", () => {
  it("HelpfulButton shows the count and pressed state", () => {
    const html = renderToStaticMarkup(
      <HelpfulButton initialCount={7} initialActive />,
    );
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain(">7<");
  });

  it("PostCard shows title, type and comment count", () => {
    const post = MOCK_POSTS[0];
    const html = renderToStaticMarkup(
      <PostCard item={{ post, commentCount: 4, viewerHelpful: false }} />,
    );
    expect(html).toContain(post.title);
    expect(html).toContain("Question");
    expect(html).toContain("4 comments");
    expect(html).toContain(`/community/${post.id}`);
  });

  it("CommentThread renders nested comments and the accepted answer", () => {
    const comments = MOCK_COMMENTS.filter((c) => c.post_id === MOCK_POSTS[0].id);
    const html = renderToStaticMarkup(<CommentThread comments={comments} />);
    expect(html).toContain("Accepted answer");
    expect(html).toContain("Bring a printed copy");
  });

  it("CommentThread shows an empty state", () => {
    const html = renderToStaticMarkup(<CommentThread comments={[]} />);
    expect(html).toContain("No comments yet");
  });
});
