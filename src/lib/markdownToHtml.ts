import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export default async function markdownToHtml(markdown: string) {
  // Pre-process: convert :::grid / :::col-N / :::end to HTML grid layout
  let processed = markdown;

  // Process :::grid ... :::end blocks
  processed = processed.replace(
    /^:::grid\s*$([\s\S]*?)^:::end\s*$/gm,
    (_, innerBlock: string) => {
      // Parse columns: :::col-N ... ::: pairs
      const colRegex = /:::col-(\d+)\s*\n([\s\S]*?):::/g;
      const columns: { start: number; end: number; content: string }[] = [];
      let match;
      let lastEnd = 0;

      while ((match = colRegex.exec(innerBlock)) !== null) {
        const colNum = parseInt(match[1]);
        const content = match[2].trim();

        if (columns.length > 0) {
          // The previous column's end number is this col's start - 1
          // But if previous col didn't have an explicit end, set it
          const prev = columns[columns.length - 1];
          if (prev.end === 0) {
            prev.end = colNum - 1;
          }
        }

        columns.push({ start: colNum, end: 0, content });
        lastEnd = colNum;
      }

      // Set the last column's end to its start (span 1) if not set
      if (columns.length > 0 && columns[columns.length - 1].end === 0) {
        columns[columns.length - 1].end = columns[columns.length - 1].start;
      }

      // Calculate total span units = max end value
      const totalSpan = columns.reduce((max, col) => Math.max(max, col.end), 0);

      // Build grid HTML
      const gridCols = totalSpan || columns.length;
      let html = `<div class="md-grid" style="grid-template-columns: repeat(${gridCols}, 1fr);">`;

      for (const col of columns) {
        const span = col.end - col.start + 1;
        const spanStyle = span > 1 ? ` style="grid-column: span ${span};"` : '';
        html += `<div class="md-grid-col"${spanStyle}>\n\n${col.content}\n\n</div>`;
      }

      html += '</div>\n';
      return html;
    }
  );

  // Legacy support: simple :::columns-N / ::: syntax
  processed = processed.replace(
    /^:::columns-(\d+)\s*$/gm,
    '<div class="md-columns-$1">'
  ).replace(
    /^:::\s*$/gm,
    '</div>'
  );

  // Pre-process <aside> blocks: structure into icon + content
  processed = processed.replace(
    /<aside>\s*([\s\S]*?)\s*<\/aside>/g,
    (_, inner: string) => {
      const trimmed = inner.trim();
      // Split icon (first line) from body (rest)
      const lines = trimmed.split(/\n/);
      const firstLine = lines[0].trim();
      const rest = lines.slice(1).join('\n').trim();

      // Wrap each paragraph in the body with <p>
      const paragraphs = rest
        .split(/\n\n+/)
        .filter(p => p.trim())
        .map(p => `<p>${p.trim()}</p>`)
        .join('\n');

      // Check if icon is an <img> tag or emoji text
      const iconHtml = firstLine.startsWith('<img')
        ? `<span class="aside-icon">${firstLine}</span>`
        : `<span class="aside-icon">${firstLine}</span>`;

      return `<aside>${iconHtml}<div class="aside-content">${paragraphs}</div></aside>`;
    }
  );

  // Fix CJK bold: **text** adjacent to CJK characters doesn't parse in CommonMark
  // Convert **text** to <strong>text</strong> when adjacent to CJK chars or punctuation
  processed = processed.replace(
    /\*\*(.+?)\*\*/g,
    '<strong>$1</strong>'
  );

  const result = await remark().use(remarkGfm).use(html, { sanitize: false }).process(processed);
  let htmlStr = result.toString();

  // Wrap <img> with non-empty alt text in <figure> with <figcaption>
  htmlStr = htmlStr.replace(
    /<img\s+src="([^"]+)"\s+alt="([^"]+)"\s*\/?>/g,
    (match, src, alt) => {
      if (!alt || alt === 'undefined') return match;
      return `<figure><img src="${src}" alt="${alt}" /><figcaption>${alt}</figcaption></figure>`;
    }
  );

  // Also handle alt-first order: <img alt="..." src="...">
  htmlStr = htmlStr.replace(
    /<img\s+alt="([^"]+)"\s+src="([^"]+)"\s*\/?>/g,
    (match, alt, src) => {
      if (!alt || alt === 'undefined') return match;
      return `<figure><img src="${src}" alt="${alt}" /><figcaption>${alt}</figcaption></figure>`;
    }
  );

  // Open external links in a new tab
  htmlStr = htmlStr.replace(
    /<a\s+href="(https?:\/\/[^"]+)"/g,
    '<a href="$1" target="_blank" rel="noopener noreferrer"'
  );

  return htmlStr;
}
