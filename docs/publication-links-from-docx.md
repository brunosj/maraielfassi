# Publication links from the Word consultancy doc

Hyperlinks in `mef-content.docx` are stored in Office Open XML (`word/document.xml` + `word/_rels/document.xml.rels`). The repo includes a small extractor that does not need extra npm packages — it shells out to `unzip`.

## Re-run extraction

From the project root:

```bash
npm run extract:docx-links
```

Or pass another file:

```bash
node scripts/extract-docx-hyperlinks.mjs "/path/to/file.docx"
```

Output is JSON on stdout: every hyperlink run (`linkText`, `url`, `rId`) plus a `unique` list deduped by URL.

## Site content

Publication URLs for the live site live in Keystatic (**Publications** → **URL**) or in `src/content/publications/*.yaml` as the `url` field. The publications page turns the citation into a link when `url` is set.

After updating the Word source, extract links again and reconcile any new or changed URLs with those YAML entries (or Keystatic).
