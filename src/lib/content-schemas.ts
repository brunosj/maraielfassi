import { z } from 'astro/zod';

/** Shared with `content.config.ts` — single source of truth for runtime + Keystatic-backed files. */
export const siteSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  /** Public URL path from Keystatic `fields.image` + `publicPath` (e.g. `/images/hero/index/heroImage.jpg`). */
  heroImage: z.string().nullish(),
  heroImageAlt: z.string().nullish(),
  metaDescription: z.string().optional(),
  intro: z.string(),
  contactEmail: z.string(),
  linkedinUrl: z.string(),
  languages: z.array(
    z.object({
      language: z.string(),
      level: z.string(),
    }),
  ),
});

export const serviceFrontmatterSchema = z.object({
  title: z.string(),
  order: z.number(),
  summary: z.string(),
  serviceIncludes: z.array(z.string()),
  selectedExperience: z.array(z.string()),
});

export const publicationSchema = z.object({
  slug: z.string(),
  citation: z.string(),
  category: z.enum(['article', 'report', 'policy', 'video']),
  url: z.string().optional(),
  year: z.number().optional().nullable(),
  languageNote: z.string().optional(),
  sortOrder: z.number().optional().nullable(),
});

export type SiteData = z.infer<typeof siteSchema>;
export type ServiceFrontmatter = z.infer<typeof serviceFrontmatterSchema>;
export type PublicationData = z.infer<typeof publicationSchema>;

export type LiveService = ServiceFrontmatter & {
  /** Rendered Markdoc body (HTML string). */
  bodyHtml: string;
};
