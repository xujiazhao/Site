import type { ReactNode } from "react";

type Props = {
  content: string;
};

const TOKEN_PATTERN = /(\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|\*\*([^*\n]+)\*\*|(https?:\/\/[^\s<]+))/g;
const TRAILING_URL_PUNCTUATION = /[.,!?;:，。！？；：]+$/;

export function ChatMessageContent({ content }: Props) {
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  TOKEN_PATTERN.lastIndex = 0;
  while ((match = TOKEN_PATTERN.exec(content)) !== null) {
    if (match.index > cursor) {
      nodes.push(content.slice(cursor, match.index));
    }

    const key = `${match.index}-${match[0].length}`;
    const markdownLabel = match[2];
    const markdownUrl = match[3];
    const boldText = match[4];
    const bareUrl = match[5];

    if (markdownLabel && markdownUrl) {
      nodes.push(
        <a
          key={key}
          href={markdownUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
        >
          {markdownLabel}
        </a>,
      );
    } else if (boldText) {
      nodes.push(<strong key={key}>{boldText}</strong>);
    } else if (bareUrl) {
      const punctuation = bareUrl.match(TRAILING_URL_PUNCTUATION)?.[0] || "";
      const href = punctuation ? bareUrl.slice(0, -punctuation.length) : bareUrl;
      nodes.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline underline-offset-2"
        >
          {href}
        </a>,
      );
      if (punctuation) nodes.push(punctuation);
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < content.length) nodes.push(content.slice(cursor));

  return <>{nodes}</>;
}
