import { Fragment } from "react";
import { ExternalLink } from "lucide-react";
import {
  parseGuideBlocks,
  parseInlineTokens,
  type GuideListBlock,
  type InlineToken,
} from "@/lib/knowledge/format";

function InlineTokens({ tokens }: { tokens: InlineToken[] }) {
  return (
    <>
      {tokens.map((token, idx) => {
        if (token.type === "text") {
          return <Fragment key={idx}>{token.value}</Fragment>;
        }
        if (token.type === "strong") {
          return (
            <strong key={idx} className="font-semibold text-brand-950">
              <InlineTokens tokens={token.children} />
            </strong>
          );
        }
        if (token.type === "em") {
          return (
            <em key={idx} className="italic text-brand-800">
              {token.value}
            </em>
          );
        }
        return (
          <a
            key={idx}
            href={token.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline font-medium text-brand-700 underline decoration-brand-400 underline-offset-4 break-words hover:text-brand-950 hover:decoration-brand-950"
          >
            {token.label}
            <ExternalLink
              className="ml-1 inline size-3.5 align-[-2px]"
              aria-hidden="true"
            />
          </a>
        );
      })}
    </>
  );
}

function ListBlock({
  block,
  nested = false,
}: {
  block: GuideListBlock;
  nested?: boolean;
}) {
  const isBullet = block.style === "bullet";
  const ListTag = isBullet ? "ul" : "ol";
  const listStyleClass = isBullet
    ? "list-disc"
    : block.style === "alpha"
      ? "list-[lower-alpha]"
      : "list-decimal";
  const spacingClass = nested
    ? "mt-2 space-y-1.5 pl-5 text-body sm:text-[0.95rem] sm:leading-[1.65] text-brand-900 marker:text-brand-600"
    : "space-y-2.5 pl-6 marker:font-medium marker:text-brand-700";

  return (
    <ListTag
      start={!isBullet && block.start > 1 ? block.start : undefined}
      className={`${listStyleClass} ${spacingClass}`}
    >
      {block.items.map((item, idx) => (
        <li key={idx} className="text-pretty pl-1">
          <InlineTokens tokens={parseInlineTokens(item.text)} />
          {item.children.map((child, childIdx) => (
            <ListBlock key={childIdx} block={child} nested />
          ))}
        </li>
      ))}
    </ListTag>
  );
}

/**
 * Renders structured guide content (headings, nested lists, inline links, bold)
 * cleanly using Campus Compass typographic tokens while staying compatible with
 * plain-text sample guides.
 */
export function GuideContent({ content }: { content: string }) {
  const blocks = parseGuideBlocks(content);

  return (
    <div className="flex w-full flex-col gap-4 text-[1rem] leading-[1.7] text-brand-950 sm:text-[1.0625rem]">
      {blocks.map((block, idx) => {
        if (block.type === "heading") {
          if (block.level === 2) {
            return (
              <h2
                key={idx}
                className="text-h3 mt-5 border-b border-brand-300/70 pb-1.5 text-balance text-brand-950 first:mt-0"
              >
                <InlineTokens tokens={parseInlineTokens(block.text)} />
              </h2>
            );
          }
          return (
            <h3
              key={idx}
              className="text-h4 mt-2 font-semibold text-balance text-brand-900 first:mt-0"
            >
              <InlineTokens tokens={parseInlineTokens(block.text)} />
            </h3>
          );
        }

        if (block.type === "list") {
          return <ListBlock key={idx} block={block} />;
        }

        return (
          <p key={idx} className="text-pretty text-brand-950">
            {block.lines.map((line, lineIdx) => (
              <Fragment key={lineIdx}>
                {lineIdx > 0 ? <br /> : null}
                <InlineTokens tokens={parseInlineTokens(line)} />
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
