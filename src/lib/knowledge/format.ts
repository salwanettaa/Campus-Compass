/**
 * Lightweight structured-Markdown parser and excerpt helpers for Knowledge Hub
 * guides. Zero external dependencies; designed for safe server/client rendering.
 */

export type InlineToken =
  | { type: "text"; value: string }
  | { type: "strong"; children: InlineToken[] }
  | { type: "em"; value: string }
  | { type: "link"; label: string; href: string };

export type ListStyle = "bullet" | "decimal" | "alpha";

export interface GuideListItem {
  text: string;
  children: GuideListBlock[];
}

export interface GuideListBlock {
  type: "list";
  style: ListStyle;
  start: number;
  items: GuideListItem[];
}

export type GuideBlock =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; lines: string[] }
  | GuideListBlock;

/** Only allows http(s) URLs so untrusted values can never execute scripts. */
export function safeHttpUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" || parsed.protocol === "http:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

/** Strips Markdown syntax into clean plain text for compact list card excerpts. */
export function stripMarkdownForExcerpt(raw: string): string {
  const lines = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) return "";

  const firstBodyLine = lines.find((line) => !/^#{1,6}\s+/.test(line)) ?? lines[0];

  return firstBodyLine
    .replace(/^#{1,6}\s+/, "")
    .replace(/^(?:-|(?:\d+|[a-zA-Z])\.)\s+/, "")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, "$1")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/\*([^*\n]+)\*/g, "$1")
    .trim();
}

const INLINE_PATTERN =
  /\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s)<>]+)|\*\*([^*\n]+)\*\*|\*([^*\n]+)\*/g;

function parseEmphasisAndUrls(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, index) });
    }

    const [full, mdLabel, mdHref, bareUrl, boldText, emText] = match;
    if (mdLabel && mdHref) {
      const valid = safeHttpUrl(mdHref);
      if (valid) {
        tokens.push({ type: "link", label: mdLabel, href: valid });
      } else {
        tokens.push({ type: "text", value: mdLabel });
      }
    } else if (bareUrl) {
      const candidate = bareUrl.replace(/[.,;]+$/, "");
      const trailing = bareUrl.slice(candidate.length);
      const valid = safeHttpUrl(candidate);
      if (valid) {
        const cleanLabel = candidate.replace(/^https?:\/\//i, "");
        tokens.push({ type: "link", label: cleanLabel, href: valid });
        if (trailing) tokens.push({ type: "text", value: trailing });
      } else {
        tokens.push({ type: "text", value: bareUrl });
      }
    } else if (boldText) {
      tokens.push({ type: "strong", children: parseEmphasisAndUrls(boldText) });
    } else if (emText) {
      tokens.push({ type: "em", value: emText });
    } else {
      tokens.push({ type: "text", value: full });
    }

    lastIndex = index + full.length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }

  return tokens;
}

/** Parses inline links, bold, and italics safely. */
export function parseInlineTokens(text: string): InlineToken[] {
  return parseEmphasisAndUrls(text);
}

interface ParsedListLine {
  indent: number;
  style: ListStyle;
  start: number;
  text: string;
}

function matchListLine(line: string): ParsedListLine | null {
  const m = line.match(/^( *)(-|(\d+)\.|([a-z])\.)\s+(.*)$/);
  if (!m) return null;
  const [, spaces, marker, numStr, alphaStr, rest] = m;
  const indent = spaces.length;
  if (marker === "-") {
    return { indent, style: "bullet", start: 1, text: rest };
  }
  if (numStr) {
    return { indent, style: "decimal", start: Number(numStr), text: rest };
  }
  return {
    indent,
    style: "alpha",
    start: alphaStr.charCodeAt(0) - 96,
    text: rest,
  };
}

function parseListBlock(
  lines: string[],
  startIdx: number,
  baseIndent: number,
  style: ListStyle,
): { block: GuideListBlock; nextIdx: number } {
  const firstLine = matchListLine(lines[startIdx]);
  const block: GuideListBlock = {
    type: "list",
    style,
    start: firstLine?.start ?? 1,
    items: [],
  };

  let idx = startIdx;
  while (idx < lines.length) {
    const raw = lines[idx];
    if (!raw.trim()) {
      break;
    }

    const parsed = matchListLine(raw);
    if (!parsed) {
      break;
    }
    if (parsed.indent < baseIndent) {
      break;
    }
    if (parsed.indent > baseIndent) {
      const prevItem = block.items[block.items.length - 1];
      if (!prevItem) break;
      const nested = parseListBlock(lines, idx, parsed.indent, parsed.style);
      prevItem.children.push(nested.block);
      idx = nested.nextIdx;
      continue;
    }
    if (parsed.style !== style) {
      break;
    }

    block.items.push({ text: parsed.text, children: [] });
    idx += 1;
  }

  return { block, nextIdx: idx };
}

/** Splits guide Markdown/plain text into headings, nested lists, and paragraphs. */
export function parseGuideBlocks(content: string): GuideBlock[] {
  const lines = content.replace(/\r/g, "").split("\n");
  const blocks: GuideBlock[] = [];
  let idx = 0;

  while (idx < lines.length) {
    const line = lines[idx];
    const trimmed = line.trim();

    if (!trimmed) {
      idx += 1;
      continue;
    }

    const headingMatch = trimmed.match(/^(#{2,3})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length === 2 ? 2 : 3;
      blocks.push({ type: "heading", level, text: headingMatch[2].trim() });
      idx += 1;
      continue;
    }

    const listMatch = matchListLine(line);
    if (listMatch) {
      const { block, nextIdx } = parseListBlock(
        lines,
        idx,
        listMatch.indent,
        listMatch.style,
      );
      blocks.push(block);
      idx = nextIdx;
      continue;
    }

    const paragraphLines: string[] = [];
    while (idx < lines.length) {
      const cur = lines[idx];
      const curTrimmed = cur.trim();
      if (!curTrimmed) break;
      if (/^#{2,3}\s+/.test(curTrimmed)) break;
      if (matchListLine(cur)) break;
      paragraphLines.push(curTrimmed);
      idx += 1;
    }
    if (paragraphLines.length > 0) {
      blocks.push({ type: "paragraph", lines: paragraphLines });
    }
  }

  return blocks;
}
