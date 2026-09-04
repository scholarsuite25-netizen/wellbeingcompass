import React from "react";

// Lightweight, safe inline markup for structured blocks.
// Tokens: **bold**, *italic*, __underline__, `code`, [label](url). Line breaks become <br/>.
type Token = { re: RegExp; render: (m: RegExpExecArray, key: number) => React.ReactNode };

const TOKENS: Token[] = [
  {
    re: /^\[([^\]]+)\]\(([^)\s"']+)\)/,
    render: (m, key) => (
      <a key={key} href={m[2]} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline">
        {m[1]}
      </a>
    ),
  },
  { re: /^\*\*([^*]+)\*\*/, render: (m, key) => <strong key={key}>{m[1]}</strong> },
  { re: /^\*([^*]+)\*/, render: (m, key) => <em key={key}>{m[1]}</em> },
  { re: /^__([^_]+)__/, render: (m, key) => <u key={key}>{m[1]}</u> },
  {
    re: /^`([^`]+)`/,
    render: (m, key) => (
      <code key={key} className="rounded bg-surface border border-border px-1 py-0.5 text-[0.9em]">
        {m[1]}
      </code>
    ),
  },
];

function renderLine(line: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let rest = line;
  let key = 0;
  while (rest.length > 0) {
    let consumed = 0;
    for (const t of TOKENS) {
      const m = t.re.exec(rest);
      if (m && m.index === 0) {
        const textHead = rest.slice(0, m.index);
        if (textHead) nodes.push(textHead);
        nodes.push(t.render(m, key++));
        consumed = m[0].length;
        break;
      }
    }
    if (consumed === 0) {
      nodes.push(rest.slice(0, Math.min(20, rest.length)));
      rest = rest.slice(Math.min(20, rest.length));
    } else {
      rest = rest.slice(consumed);
    }
  }
  return nodes;
}

export function renderInline(text: string | undefined | null): React.ReactNode {
  if (!text) return null;
  const lines = text.split("\n");
  const out: React.ReactNode[] = [];
  lines.forEach((line, i) => {
    if (i > 0) out.push(<br key={`br${i}`} />);
    out.push(<React.Fragment key={`l${i}`}>{renderLine(line)}</React.Fragment>);
  });
  return out;
}

export function stripMarkup(text: string | undefined | null): string {
  if (!text) return "";
  return text
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}