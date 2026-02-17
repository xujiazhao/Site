import { remark } from "remark";
import html from "remark-html";

export default async function markdownToHtml(markdown: string) {
  const result = await remark().use(html, { sanitize: false }).process(markdown);
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

  return htmlStr;
}
