import { config, fields, collection, singleton } from '@keystatic/core';

/** Short label for array rows backed by a single text field (avoids generic "Item 1", "Item 2"). */
function itemLabelFromText(emptyLabel: string, maxLen = 72) {
  return (props: { readonly value: string }) => {
    const t = props.value?.trim().replace(/\s+/g, ' ') ?? '';
    if (!t) return emptyLabel;
    return t.length > maxLen ? `${t.slice(0, maxLen)}…` : t;
  };
}

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: { name: 'Marai El Fassi' },
  },
  singletons: {
    site: singleton({
      label: 'Site',
      path: 'src/content/site/',
      format: 'yaml',
      schema: {
        name: fields.text({ label: 'Name' }),
        tagline: fields.text({ label: 'Tagline' }),
        metaDescription: fields.text({
          label: 'Meta description',
          multiline: true,
        }),
        intro: fields.text({ label: 'Introduction', multiline: true }),
        contactEmail: fields.text({ label: 'Contact email' }),
        linkedinUrl: fields.text({ label: 'LinkedIn URL' }),
        languages: fields.array(
          fields.object({
            language: fields.text({ label: 'Language' }),
            level: fields.text({ label: 'Level' }),
          }),
          {
            label: 'Languages',
            itemLabel: (props) => {
              const lang = props.fields.language.value?.trim() ?? '';
              const level = props.fields.level.value?.trim() ?? '';
              if (lang && level) return `${lang} – ${level}`;
              if (lang) return lang;
              if (level) return level;
              return 'Language';
            },
          },
        ),
      },
    }),
  },
  collections: {
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { contentField: 'body' },
      schema: {
        title: fields.slug({
          name: {
            label: 'Title',
          },
          slug: {
            label: 'Filename slug',
            description:
              'Becomes the .mdoc filename (e.g. mel). Lowercase and hyphens.',
          },
        }),
        order: fields.number({ label: 'Order' }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        serviceIncludes: fields.array(fields.text({ label: 'Item' }), {
          label: 'Services include',
          itemLabel: itemLabelFromText('Service item'),
        }),
        selectedExperience: fields.array(fields.text({ label: 'Item' }), {
          label: 'Selected experience',
          itemLabel: itemLabelFromText('Experience item'),
        }),
        body: fields.markdoc({
          label: 'Detailed description',
          options: {
            image: {
              directory: 'src/assets/images/services',
              publicPath: '../../assets/images/services/',
            },
          },
        }),
      },
    }),
    publications: collection({
      label: 'Publications',
      slugField: 'slug',
      path: 'src/content/publications/*',
      format: 'yaml',
      schema: {
        slug: fields.slug({
          name: {
            label: 'Title',
            description:
              'Shown on the publications page. Used to suggest the filename field below.',
          },
          slug: {
            label: 'Filename',
            description:
              'URL-safe name for the .yaml file (e.g. my-paper-2024). Lowercase and hyphens.',
          },
        }),
        citation: fields.text({ label: 'Citation', multiline: true }),
        category: fields.select({
          label: 'Category',
          options: [
            { label: 'Article', value: 'article' },
            { label: 'Report', value: 'report' },
            { label: 'Policy paper, brief or blog', value: 'policy' },
            { label: 'Video', value: 'video' },
          ],
          defaultValue: 'article',
        }),
        url: fields.text({ label: 'URL' }),
        year: fields.integer({ label: 'Year' }),
        languageNote: fields.text({ label: 'Language note' }),
        sortOrder: fields.integer({ label: 'Sort order' }),
      },
    }),
  },
});
