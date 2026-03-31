import fs from 'node:fs/promises';
import path from 'node:path';
import Markdoc from '@markdoc/markdoc';
import yaml from 'js-yaml';
import {
  publicationSchema,
  serviceFrontmatterSchema,
  siteSchema,
  type LiveService,
  type PublicationData,
  type SiteData,
} from './content-schemas';

function contentRoot(): string {
  return path.join(process.cwd(), 'src', 'content');
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
  const filePath = path.join(contentRoot(), 'site', 'index.yaml');
  const raw = await fs.readFile(filePath, 'utf8');
  const data = yaml.load(raw);
  return siteSchema.parse(data);
}

export async function loadPublicationsLive(): Promise<PublicationData[]> {
  const dir = path.join(contentRoot(), 'publications');
  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') return [];
    throw e;
  }
  const yamlFiles = names.filter((n) => n.endsWith('.yaml') || n.endsWith('.yml'));
  const out: PublicationData[] = [];
  for (const name of yamlFiles) {
    const raw = await fs.readFile(path.join(dir, name), 'utf8');
    const data = yaml.load(raw);
    out.push(publicationSchema.parse(data));
  }
  return out;
}

export async function loadServicesLive(): Promise<LiveService[]> {
  const dir = path.join(contentRoot(), 'services');
  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') return [];
    throw e;
  }
  const mdocFiles = names.filter((n) => n.endsWith('.mdoc'));
  const out: LiveService[] = [];
  for (const name of mdocFiles) {
    const raw = await fs.readFile(path.join(dir, name), 'utf8');
    const { frontmatter, body } = splitYamlFrontmatter(raw);
    const fm = yaml.load(frontmatter);
    const data = serviceFrontmatterSchema.parse(fm);
    const bodyHtml = renderMarkdocBody(body);
    out.push({ ...data, bodyHtml });
  }
  return out;
}
