import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  publicationSchema,
  serviceFrontmatterSchema,
  siteSchema,
} from './lib/content-schemas';

const site = defineCollection({
  loader: glob({
    base: './src/content/site',
    pattern: '**/*.{yaml,yml}',
  }),
  schema: siteSchema,
});

const services = defineCollection({
  loader: glob({
    base: './src/content/services',
    pattern: '**/*.mdoc',
  }),
  schema: serviceFrontmatterSchema,
});

const publications = defineCollection({
  loader: glob({
    base: './src/content/publications',
    pattern: '**/*.{yaml,yml}',
  }),
  schema: publicationSchema,
});

export const collections = { site, services, publications };
