// Walk content/data/** and produce src/generated/*.json that consumer
// components import at build time.
//
// Run automatically via `prebuild`. Safe to run any time:
//    node scripts/build-content.mjs

import { readdir, readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'content', 'data');
const OUT = join(ROOT, 'src', 'generated');

async function listMarkdown(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isFile() && /\.(md|mdx)$/i.test(e.name))
    .map((e) => join(dir, e.name))
    .sort();
}

async function readCollection(name) {
  const dir = join(SRC, name);
  const files = await listMarkdown(dir);
  const out = [];
  for (const f of files) {
    const raw = await readFile(f, 'utf8');
    const { data, content } = matter(raw);
    out.push({
      _file: basename(f),
      ...data,
      body: (content || '').trim(),
    });
  }
  return out;
}

async function readSingletonYaml(name) {
  // We import gray-matter just for YAML parsing (it ships with js-yaml).
  // Treat the file as frontmatter-only: prepend "---" wrapper.
  const file = join(SRC, name);
  let raw;
  try {
    raw = await readFile(file, 'utf8');
  } catch {
    return null;
  }
  const wrapped = raw.startsWith('---') ? raw : `---\n${raw}\n---\n`;
  const { data } = matter(wrapped);
  return data;
}

async function writeJson(name, data) {
  await mkdir(OUT, { recursive: true });
  const file = join(OUT, `${name}.json`);
  await writeFile(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`  ${name}.json (${Array.isArray(data) ? data.length + ' items' : 'object'})`);
}

async function main() {
  console.log('Building content artifacts -> src/generated/');

  // Collections (one markdown file per record)
  const faqs = (await readCollection('faqs'))
    .filter((r) => !r.draft && r.question && r.body)
    .map((r) => ({
      id: Number(r.id) || r.id,
      question: r.question,
      answer: r.body,
    }))
    .sort((a, b) => Number(a.id) - Number(b.id));
  await writeJson('faqs', faqs);

  const research = (await readCollection('research'))
    .filter((r) => r.title && r.image_link)
    .map((r) => ({
      id: r._file,
      title: r.title,
      summary: r.body || '',
      description: r.body || '',
      image_link: r.image_link,
      date: r.date || '',
      subcategory: r.subcategory || '',
      link: r.link || '#',
      outlet: r.outlet || '',
      readTime: r.read_time || '',
      keywords: Array.isArray(r.keywords) ? r.keywords : [],
      tags: Array.isArray(r.keywords) ? r.keywords : [],
    }));
  await writeJson('research', research);

  const team = (await readCollection('team'))
    .filter((r) => (r.first_name || r.last_name) && r.image_link)
    .map((r) => ({
      title: r.title || '',
      first_name: r.first_name || '',
      last_name: r.last_name || '',
      role: r.role || '',
      organization: r.organization || '',
      image_link: r.image_link,
      order: r.order ?? 0,
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  await writeJson('team', team);

  const partners = (await readCollection('partners'))
    .filter((r) => (r.first_name || r.last_name) && r.image_link)
    .map((r) => ({
      first_name: r.first_name || '',
      last_name: r.last_name || '',
      role: r.role || '',
      organization: r.organization || '',
      subcategory: r.subcategory || '',
      image_link: r.image_link,
      link: r.link || '',
      order: r.order ?? 0,
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  await writeJson('partners', partners);

  const resources = (await readCollection('resources'))
    .filter((r) => r.organization)
    .map((r, i) => ({
      id: r.order ?? i,
      category: r.category || '',
      abbreviation: r.abbreviation || '',
      name: r.organization,
      description: r.body || '',
      url: r.link || '',
      thumbnail: r.thumbnail || '',
    }))
    .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  await writeJson('resources', resources);

  const indicators = (await readCollection('indicators'))
    .filter((r) => r.indicator)
    .map((r, i) => ({
      id: r.order ?? i,
      indicator: r.indicator,
      cats: Array.isArray(r.categories)
        ? r.categories
        : String(r.categories || '')
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean),
      desc: r.body || '',
      geography: r.geography || '',
      sampleInterpretation: r.sample_interpretation || '',
      source: r.source || '',
    }))
    .sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
  await writeJson('indicators', indicators);

  // Singletons
  const counties = await readSingletonYaml('counties-with-factsheets.yml');
  await writeJson(
    'counties-with-factsheets',
    Array.isArray(counties?.counties) ? counties.counties : [],
  );

  const summary = await readSingletonYaml('summary-stats.yml');
  await writeJson('summary-stats', Array.isArray(summary?.rows) ? summary.rows : []);

  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
