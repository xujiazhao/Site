# xujiazhao.com

Personal portfolio site for Jiazhao Xu (许嘉昭) — designer at Microsoft.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Content**: Markdown with gray-matter frontmatter
- **CMS**: [Pages CMS](https://pagescms.org) for content management
- **Fonts**: Barlow (English), system default (Chinese)
- **i18n**: English (`/en`) and Chinese (`/zh`)

## Structure

```
content/
  en/           # English content (experience, project, writing)
  zh/           # Chinese content
  creation/     # Shared across languages
public/
  assets/images/  # All media assets
src/
  app/[lang]/   # Language-routed pages
  lib/          # API, markdown processing
```

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # Production build
```

## Content Management

Content is managed via Markdown files with frontmatter. Use [Pages CMS](https://pagescms.org) for a visual editing interface, or edit `.md` files directly.

## License

All rights reserved. © Jiazhao Xu
