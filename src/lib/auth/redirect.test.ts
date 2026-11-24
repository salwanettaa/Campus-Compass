import { describe, expect, it } from "vitest";
import { safeNextPath } from "./redirect";

describe("safeNextPath", () => {
  it.each([
    ["/home", "/home"],
    ["/community?type=question", "/community?type=question"],
    ["/home#my-journey", "/home#my-journey"],
  ])("allows internal path %s", (input, expected) => {
    expect(safeNextPath(input)).toBe(expected);
  });

  it.each([
    "//evil.com",
    "//evil.com/path",
    "https://evil.com",
    "http://evil.com",
    "javascript:alert(1)",
    "data:text/html,<script>1</script>",
    "evil.com",
    "",
    "/\\evil.com",
    "\\\\evil.com",
    "/path\\with-backslash",
  ])("rejects %j and returns the fallback", (input) => {
    expect(safeNextPath(input)).toBe("/home");
  });

  it.each([null, undefined, 42, {}, []])(
    "rejects non-string value %j",
    (input) => {
      expect(safeNextPath(input)).toBe("/home");
    },
  );

  it("uses a custom fallback", () => {
    expect(safeNextPath("//evil.com", "/login")).toBe("/login");
  });
});
