# Keystatic CMS in this project

This document describes how [Keystatic](https://keystatic.com/) is wired up for the consultant site: where content lives, what you can edit in the UI, and how that connects to Astro.

## What Keystatic does here

Keystatic is a **Git-based CMS UI** that runs alongside the Astro app. When you save in the admin:

- Content is written to **files in the repo** (YAML or Markdoc under `src/content/`, plus images under `src/assets/`).
- The **public site** is built from those same files via Astro [content collections](https://docs.astro.build/en/guides/content-collections/) (`src/content.config.ts`).

There is no separate database for content in **local** mode.

## Admin UI

- **URL:** `/keystatic` (with the dev server: e.g. `http://localhost:4321/keystatic`).
- **Config file:** [`keystatic.config.ts`](../keystatic.config.ts) at the project root defines collections, fields, and output paths.
- **Astro integration:** `@keystatic/astro` is registered in [`astro.config.mjs`](../astro.config.mjs).

## Storage mode

```ts
storage: { kind: 'local' }
```

Edits are saved **directly to the filesystem** in this repository. Commit and push those files like any other code change.

To use **GitHub** or **Keystatic Cloud** storage instead, you would change `storage` in `keystatic.config.ts` and follow Keystatic’s docs for that mode (OAuth, branches, etc.).

## Content model (high level)

| Keystatic concept | In this project | On disk |
|------------------|-----------------|---------|
| **Singleton** | `site` | `src/content/site/index.yaml` |
| **Collection** | `services` | `src/content/services/<slug>.mdoc` |
| **Collection** | `publications` | `src/content/publications/<slug>.yaml` |

Singletons are “one global record” (site settings). Collections are many entries (each service, each publication).

## Site singleton (`site`)

- **Path:** `src/content/site/` with trailing slash → Keystatic writes **`index.yaml`** there.
- **Format:** YAML only (no separate Markdoc body).
- **Fields:** name, tagline, meta description, multiline intro, contact email, LinkedIn URL, and a list of languages (`language` + `level` per row).

Used on every page for the header, footer, meta description, and homepage intro.

## Services collection (`services`)

- **Path pattern:** `src/content/services/*`
- **Slug field:** `title` (URL slug, e.g. `mel`, `qualitative-research`). Shown in filenames: `<slug>.mdoc`.
- **Format:** Markdoc with **`body`** as the main rich-text field (`format: { contentField: 'body' }`).
- **Other fields (YAML front matter in the `.mdoc` file):** `title` (from the slug field; shown as the service heading on the site), `order` (sort on the homepage), `summary`, repeatable `serviceIncludes` and `selectedExperience` lines.

**Images** in the Markdoc body are stored under `src/assets/images/services/`; `publicPath` in config is set so the site can resolve them.

## Publications collection (`publications`)

- **Path pattern:** `src/content/publications/*`
- **Slug field:** `slug` → one YAML file per publication, e.g. `some-slug.yaml`.
- **Format:** YAML only.
- **Fields:** `slug` (Keystatic slug field: **Title** + **Filename** in the UI; in YAML the `slug` key holds the title text, and the file name is the URL-safe slug), full `citation` (multiline), `category` (`article` | `report` | `policy` | `video`), optional URL, year, language note, `sortOrder` (ordering within a category on `/publications`).

If `url` is set, the publications list links the citation; otherwise it shows plain text. The title from the slug field is shown above the citation.

## How Astro picks up the same files

[`src/content.config.ts`](../src/content.config.ts) defines three collections with explicit **`glob()` loaders** (no legacy compatibility flag):

| Astro collection | Loader `base` | Pattern | Role |
|------------------|---------------|---------|------|
| `site` | `./src/content/site` | `**/*.{yaml,yml}` | Data |
| `services` | `./src/content/services` | `**/*.mdoc` | Markdoc → `render()` in pages |
| `publications` | `./src/content/publications` | `**/*.{yaml,yml}` | Data |

**Important:** Field names and shapes should stay aligned between:

1. **`keystatic.config.ts`** (what the CMS shows and writes), and  
2. **`src/content.config.ts`** (Zod schema Astro uses at build time).

If they drift, `astro build` will report schema/content errors.

## Typical editing workflow

1. Run `pnpm dev`.
2. Open `/keystatic`, sign in if your storage mode requires it (not required for `local`).
3. Edit **Site**, **Services**, or **Publications** and save.
4. Confirm files changed under `src/content/` (and assets if you added images).
5. Commit changes. CI/production build runs `astro build`, which reads the updated files.

You can also edit the YAML/Markdoc files **directly in the editor**; Keystatic will read the same format on next open.

## Adding or changing fields

1. Update **`keystatic.config.ts`** (`fields.*` for the singleton or collection).
2. Update **`src/content.config.ts`** Zod `schema` to match (types, required vs optional, enums).
3. Run **`pnpm astro sync`** so types under `.astro/` stay current.
4. Adjust any Astro components under `src/pages/` or `src/components/` if you added new data to display.

## Further reading

- [Keystatic docs](https://keystatic.com/docs)
- [Keystatic + Astro](https://keystatic.com/docs/installation-astro)
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
