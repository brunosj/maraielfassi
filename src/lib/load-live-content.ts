import fs from 'node:fs/promises';
import path from 'node:path';
import Markdoc from '@markdoc/markdoc';
import {
  publicationSchema,
  serviceFrontmatterSchema,
  siteSchema,
  type LiveService,
  type PublicationData,
  type SiteData,
} from './content-schemas';
import { keystaticReader } from './keystatic-reader';

/** Keystatic `fields.slug` on disk is often a plain string; the reader may return `{ name, slug }`. */
function slugFieldToDisplayString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'name' in value) {
    const n = (value as { name?: unknown }).name;
    if (typeof n === 'string') return n;
  }
  throw new Error('Unexpected slug field shape from Keystatic reader');
}

function splitYamlFrontmatter(raw: string): { frontmatter: string; body: string } {
  const trimmed = raw.replace(/^\uFEFF/, '');
  if (!trimmed.startsWith('---\n')) {
    throw new Error('Expected YAML frontmatter opening ---');
  }
  const end = trimmed.indexOf('\n---\n', 4);
  if (end === -1) {
    throw new Error('Expected YAML frontmatter closing ---');
  }
  return {
    frontmatter: trimmed.slice(4, end),
    body: trimmed.slice(end + 5),
  };
}

function renderMarkdocBody(source: string): string {
  const ast = Markdoc.parse(source.trim());
  const transformed = Markdoc.transform(ast);
  return Markdoc.renderers.html(transformed) as string;
}

export async function loadSiteLive(): Promise<SiteData> {
  const data = await keystaticReader.singletons.site.readOrThrow();
  return siteSchema.parse(data);
}

export async function loadPublicationsLive(): Promise<PublicationData[]> {
  const rows = await keystaticReader.collections.publications.all();
  return rows.map(({ entry }) =>
    publicationSchema.parse({
      slug: slugFieldToDisplayString(entry.slug),
      citation: entry.citation,
      category: entry.category,
      url: entry.url,
      year: entry.year,
      languageNote: entry.languageNote,
      sortOrder: entry.sortOrder,
    }),
  );
}

/** Reader `body` is Markdoc AST; Keystatic `DocumentRenderer` expects ProseMirror JSON — see docs/keystatic-cms.md. */
async function serviceBodyHtmlFromDisk(fileSlug: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'src', 'content', 'services', `${fileSlug}.mdoc`);
  const raw = await fs.readFile(filePath, 'utf8');
  const { body } = splitYamlFrontmatter(raw);
  return renderMarkdocBody(body);
}

export async function loadServicesLive(): Promise<LiveService[]> {
  const rows = await keystaticReader.collections.services.all({ resolveLinkedFiles: true });
  const out: LiveService[] = [];
  for (const { slug: fileSlug, entry } of rows) {
    const title = slugFieldToDisplayString(entry.title);
    const fm = serviceFrontmatterSchema.parse({
      title,
      order: entry.order,
      summary: entry.summary,
      serviceIncludes: entry.serviceIncludes,
      selectedExperience: entry.selectedExperience,
    });
    const bodyHtml = await serviceBodyHtmlFromDisk(fileSlug);
    out.push({ ...fm, bodyHtml });
  }
  return out;
}
