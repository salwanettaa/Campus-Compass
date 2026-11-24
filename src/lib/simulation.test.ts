import { afterEach, describe, expect, it, vi } from "vitest";
import { parseSimulation as communitySimulation } from "@/lib/community/data";
import { parseSimulation as knowledgeSimulation } from "@/lib/knowledge/data";

describe.each([
  ["community", communitySimulation],
  ["knowledge", knowledgeSimulation],
])("%s parseSimulation", (_name, parseSimulation) => {
  afterEach(() => vi.unstubAllEnvs());

  it("honours ?mock= outside production", () => {
    vi.stubEnv("NODE_ENV", "development");
    expect(parseSimulation("error")).toBe("error");
    expect(parseSimulation("empty")).toBe("empty");
    expect(parseSimulation("anything")).toBeNull();
    expect(parseSimulation(undefined)).toBeNull();
  });

  it("is always off in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(parseSimulation("error")).toBeNull();
    expect(parseSimulation("empty")).toBeNull();
  });
});
