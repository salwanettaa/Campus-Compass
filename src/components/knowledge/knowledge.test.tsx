import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SampleChat } from "@/components/ai-navigator/sample-chat";
import { GuideContent } from "./guide-content";
import { CategoryFilter } from "./category-filter";
import { ExperienceCard } from "./experience-card";
import { GuideListCard } from "./guide-list-card";
import { countByCategory } from "@/lib/knowledge/filter";
import { stripMarkdownForExcerpt } from "@/lib/knowledge/format";
import { MOCK_EXPERIENCES, MOCK_GUIDES } from "@/lib/knowledge/mock-data";

describe("knowledge components (server render)", () => {
  it("GuideListCard shows category, source and verified date", () => {
    const html = renderToStaticMarkup(<GuideListCard guide={MOCK_GUIDES[3]} />);
    expect(html).toContain("Course registration step by step");
    expect(html).toContain("Administrative Guide");
    expect(html).toContain("Official campus source");
    expect(html).toContain("Last verified");
    expect(html).toContain(`/knowledge/${MOCK_GUIDES[3].id}`);
  });

  it("GuideListCard warns when a guide may be outdated", () => {
    const html = renderToStaticMarkup(<GuideListCard guide={MOCK_GUIDES[4]} />);
    expect(html).toContain("May be outdated");
  });

  it("CategoryFilter lists all 6 categories and marks the selected one", () => {
    const html = renderToStaticMarkup(
      <CategoryFilter
        params={{ category: "social_community", q: "" }}
        counts={countByCategory(MOCK_GUIDES)}
      />,
    );
    for (const name of [
      "Academic Survival",
      "Social &amp; Community",
      "Administrative Guide",
      "Campus Essentials",
      "Scholarship &amp; Growth",
      "Career Preparation",
    ]) {
      expect(html).toContain(name);
    }
    expect(html).toContain('aria-current="true"');
  });

  it("ExperienceCard shows the personal-experience label and all sections", () => {
    const html = renderToStaticMarkup(
      <ExperienceCard experience={MOCK_EXPERIENCES[0]} />,
    );
    expect(html).toContain("Personal experience, not official information");
    for (const label of [
      "Situation",
      "Challenge",
      "Solution",
      "Result",
      "Advice for juniors",
    ]) {
      expect(html).toContain(label);
    }
  });

  it("SampleChat labels the demo and cites sources without a fake input", () => {
    const html = renderToStaticMarkup(<SampleChat />);
    expect(html).toContain("Demo, not live");
    expect(html).not.toContain("disabled");
    expect(html).toContain("Source 1");
  });

  it("GuideContent renders structured headings, nested lists, bold labels, and safe links", () => {
    const md = [
      "## Dokumen Persyaratan",
      "a. **Pas Foto**",
      "  - Kemeja putih",
      "  - Latar biru",
      "- [Unduh Form](https://tri.sv.ugm.ac.id/form.docx)",
      "- [Bad Link](javascript:alert(1))",
    ].join("\n");
    const html = renderToStaticMarkup(<GuideContent content={md} />);
    expect(html).toContain("<h2");
    expect(html).toContain("<ol");
    expect(html).toContain("list-[lower-alpha]");
    expect(html).toContain("<ul");
    expect(html).toContain("<strong");
    expect(html).toContain('href="https://tri.sv.ugm.ac.id/form.docx"');
    expect(html).toContain("Bad Link");
    expect(html).not.toContain("javascript:alert");
  });

  it("stripMarkdownForExcerpt cleans headings, bold, and markdown links", () => {
    const excerpt = stripMarkdownForExcerpt(
      "## Judul Bagian\n- Isi [Form UKT](https://ugm.ac.id) dengan **teliti**.",
    );
    expect(excerpt).toBe("Isi Form UKT dengan teliti.");
  });
});
