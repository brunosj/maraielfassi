import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const site = defineCollection({
  loader: glob({
    base: './src/content/site',
    pattern: '**/*.{yaml,yml}',
  }),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
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
  }),
});

const services = defineCollection({
  loader: glob({
    base: './src/content/services',
    pattern: '**/*.mdoc',
  }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    summary: z.string(),
    serviceIncludes: z.array(z.string()),
    selectedExperience: z.array(z.string()),
  }),
});

const publications = defineCollection({
  loader: glob({
    base: './src/content/publications',
    pattern: '**/*.{yaml,yml}',
  }),
  schema: z.object({
    /** Publication heading; Keystatic stores the slug field’s “Title” here (filename is separate). */
    slug: z.string(),
    citation: z.string(),
    category: z.enum(['article', 'report', 'policy', 'video']),
    url: z.string().optional(),
    year: z.number().optional().nullable(),
    languageNote: z.string().optional(),
    sortOrder: z.number().optional().nullable(),
  }),
});

export const collections = { site, services, publications };
