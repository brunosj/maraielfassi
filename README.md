# Marai El Fassi — consultant website

Personal site for an independent consultant working on natural resource governance, climate policy, sustainability, and international development. The public site highlights services and a curated list of publications and videos.

## Stack

- **[Astro](https://astro.build/)** (v6) — pages, layouts, and the content layer
- **[Keystatic](https://keystatic.com/)** — local CMS UI over the same files Astro reads
- **[Markdoc](https://markdoc.dev/)** — rich service descriptions (`.mdoc`) with optional images
- **[@astrojs/node](https://docs.astro.build/en/guides/integrations-guide/node/)** — Node adapter (`standalone`) for production builds

React is included for the Keystatic admin UI, not for public pages.

## Getting started

```bash
pnpm install
pnpm dev
```

Other package managers work if you prefer; this repo includes a `pnpm-lock.yaml`.

## Scripts

| Command        | Description                    |
| -------------- | ------------------------------ |
| `pnpm dev`     | Dev server with hot reload       |
| `pnpm build`   | Production build to `dist/`    |
| `pnpm preview` | Preview the production build   |

## Local URLs (dev)

- **Site:** [http://127.0.0.1:4321](http://127.0.0.1:4321)
- **Keystatic admin:** [http://127.0.0.1:4321/keystatic](http://127.0.0.1:4321/keystatic)

## Site structure

| Route            | Purpose |
| ---------------- | ------- |
| `/`              | Hero, introduction, and **Services** (from content collections) |
| `/publications`  | Filterable list of **Publications** (citations, links, categories) |

Shared chrome: `Layout.astro` wraps pages with `Header` (home + publications nav) and `Footer` (contact and languages from site data).

## Project layout

```
src/
├── components/       # Header, Footer, ServicesSection, PublicationList
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro           # Home
│   └── publications/
│       └── index.astro       # Publications listing
├── content/                  # Edited via Keystatic and/or on disk
│   ├── site/
│   │   └── index.yaml        # Singleton: name, tagline, intro, contact, LinkedIn, languages
│   ├── services/
│   │   └── *.mdoc            # One file per service (summary, lists, Markdoc body)
│   └── publications/
│       └── *.yaml            # One file per publication
├── assets/
│   └── images/
│       └── services/         # Images referenced from service Markdoc
├── content.config.ts         # Astro collection schemas (must stay aligned with Keystatic)
env.d.ts
keystatic.config.ts           # Keystatic collections + singletons
astro.config.mjs
```

Collection definitions live in **`src/content.config.ts`** (Zod) and **`keystatic.config.ts`** (Keystatic fields). If you add or rename fields, update both.

## Content model (summary)

- **Site** (`src/content/site/index.yaml`) — global copy, SEO description, contact email, LinkedIn URL, and language proficiency list.
- **Services** (`src/content/services/*.mdoc`) — title, display order, summary, bullet lists (“services include”, “selected experience”), and a Markdoc **body** for the long description. Images are stored under `src/assets/images/services/`.
- **Publications** (`src/content/publications/*.yaml`) — title/slug, citation, category (`article` \| `report` \| `policy` \| `video`), optional URL and year, language note, and sort order.

Keystatic is configured with **`storage: { kind: 'local' }`**, so commits to this repo are the source of truth for content.
