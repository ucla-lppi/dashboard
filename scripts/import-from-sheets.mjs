// One-shot importer: fetch every Google Sheet tab the site currently uses and
// write Pages-CMS-friendly source files into content/data/.
//
//   node scripts/import-from-sheets.mjs
//
// Re-runs are safe — collection directories are wiped and rewritten.

import { mkdir, writeFile, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import Papa from 'papaparse';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'content', 'data');

const SHEET =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub';

const csvUrl = (gid) => `${SHEET}?gid=${gid}&single=true&output=csv`;

const slugify = (s = '') =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';

const pad = (n, w = 3) => String(n).padStart(w, '0');

async function fetchCsv(gid) {
  const res = await fetch(csvUrl(gid));
  if (!res.ok) throw new Error(`Fetch gid=${gid} -> ${res.status}`);
  const text = await res.text();
  const { data } = Papa.parse(text, { header: true, skipEmptyLines: true });
  return data;
}

const trim = (v) => (v == null ? '' : String(v).trim());
const splitList = (v) => trim(v).split(',').map((x) => x.trim()).filter(Boolean);

// ---- yaml emit -------------------------------------------------------------

function quoted(s) {
  return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function emitFrontmatter(obj) {
  const lines = [];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) {
      lines.push(`${k}: ""`);
      continue;
    }
    if (Array.isArray(v)) {
      if (v.length === 0) lines.push(`${k}: []`);
      else {
        lines.push(`${k}:`);
        for (const item of v) lines.push(`  - ${quoted(item)}`);
      }
      continue;
    }
    if (typeof v === 'boolean' || typeof v === 'number') {
      lines.push(`${k}: ${v}`);
      continue;
    }
    const s = String(v);
    if (s === '') {
      lines.push(`${k}: ""`);
    } else if (s.includes('\n')) {
      lines.push(`${k}: |`);
      for (const ln of s.split('\n')) lines.push(`  ${ln}`);
    } else {
      lines.push(`${k}: ${quoted(s)}`);
    }
  }
  return lines.join('\n');
}

function makeMd(frontmatter, body = '') {
  return `---\n${emitFrontmatter(frontmatter)}\n---\n${body ? body.trim() + '\n' : ''}`;
}

async function writeFileTo(dir, filename, content) {
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, filename), content, 'utf8');
}

// ---- importers -------------------------------------------------------------

async function importFaqs() {
  console.log('• FAQs');
  const rows = await fetchCsv('1166232289');
  const dir = join(DATA_DIR, 'faqs');
  await rm(dir, { recursive: true, force: true });
  let n = 0;
  for (const row of rows) {
    const question = trim(row.question || row.Question || row.Title);
    const answer = trim(row.answer || row.Answer || row.File);
    if (!question || !answer) continue;
    n++;
    const id = Number(trim(row.id || row.ID)) || n;
    const draft = trim(row.draft || row.Draft).toLowerCase() === 'yes';
    const fname = `${pad(id)}-${slugify(question)}.md`;
    await writeFileTo(dir, fname, makeMd({ id, question, draft }, answer));
  }
  console.log(`  ${n} entries`);
}

// research / newsroom / toolkits all live in one collection, distinguished by subcategory
async function importResearchTab(label, gid) {
  console.log(`• ${label}`);
  const rows = await fetchCsv(gid);
  const dir = join(DATA_DIR, 'research');
  let n = 0;
  for (const row of rows) {
    const title = trim(row.title || row.Title);
    const image = trim(row.image_link || row.image || row.File || row.Image);
    if (!title || !image) continue;
    n++;
    const date = trim(row.date || row.Date);
    const subcategory = trim(row.subcategory || row.Subcategory);
    const link = trim(row.link || row.Link) || '#';
    const summary = trim(row.summary || row.Summary || row.Description || row.description);
    const outlet = trim(row.outlet || row.Outlet);
    const keywords = splitList(row.keywords || row.Keywords || row.tags || row.Tags);
    const datePart = date.match(/\d{4}-\d{2}-\d{2}/)?.[0] || '0000-00-00';
    const fname = `${datePart}-${slugify(`${subcategory || label}-${n}-${title}`)}.md`;
    await writeFileTo(
      dir,
      fname,
      makeMd(
        {
          title,
          subcategory,
          date,
          link,
          image_link: image,
          outlet,
          keywords,
        },
        summary,
      ),
    );
  }
  console.log(`  ${n} entries (subcategory: ${label})`);
}

async function importTeam() {
  console.log('• Our Team');
  const rows = await fetchCsv('1698110171');
  const dir = join(DATA_DIR, 'team');
  await rm(dir, { recursive: true, force: true });
  let n = 0;
  for (const row of rows) {
    const first = trim(row.first_name);
    const last = trim(row.last_name);
    const image = trim(row.image_link);
    if ((!first && !last) || !image) continue;
    n++;
    await writeFileTo(
      dir,
      `${pad(n)}-${slugify(`${first}-${last}`)}.md`,
      makeMd({
        order: n,
        title: trim(row.title),
        first_name: first,
        last_name: last,
        role: trim(row.role),
        organization: trim(row.organization),
        image_link: image,
      }),
    );
  }
  console.log(`  ${n} entries`);
}

async function importPartners() {
  console.log('• Partners');
  const rows = await fetchCsv('563435215');
  const dir = join(DATA_DIR, 'partners');
  await rm(dir, { recursive: true, force: true });
  let n = 0;
  for (const row of rows) {
    const first = trim(row.first_name);
    const last = trim(row.last_name);
    const image = trim(row.image_link);
    if ((!first && !last) || !image) continue;
    n++;
    await writeFileTo(
      dir,
      `${pad(n)}-${slugify(`${first}-${last}`)}.md`,
      makeMd({
        order: n,
        first_name: first,
        last_name: last,
        role: trim(row.position || row.role),
        organization: trim(row.organization),
        subcategory: trim(row.subcategory),
        image_link: image,
        link: trim(row.link),
      }),
    );
  }
  console.log(`  ${n} entries`);
}

async function importResources() {
  console.log('• Resource Directory');
  const rows = await fetchCsv('494687510');
  const dir = join(DATA_DIR, 'resources');
  await rm(dir, { recursive: true, force: true });
  let n = 0;
  for (const row of rows) {
    const organization = trim(row.Organization || row.organization);
    if (!organization) continue;
    n++;
    await writeFileTo(
      dir,
      `${pad(n)}-${slugify(organization)}.md`,
      makeMd(
        {
          order: n,
          category: trim(row.Category || row.category),
          abbreviation: trim(row.Abbreviation || row.abbreviation),
          organization,
          link: trim(row.Link || row.link),
          thumbnail: trim(row.Thumbnail || row.thumbnail),
        },
        trim(row.Description || row.description),
      ),
    );
  }
  console.log(`  ${n} entries`);
}

async function importIndicators() {
  console.log('• Indicators (Our Data)');
  const rows = await fetchCsv('1408499517');
  const dir = join(DATA_DIR, 'indicators');
  await rm(dir, { recursive: true, force: true });
  let n = 0;
  for (const row of rows) {
    const indicator = trim(row.Indicator || row.indicator);
    if (!indicator) continue;
    n++;
    await writeFileTo(
      dir,
      `${pad(n)}-${slugify(indicator.replace(/[🔥💨]/g, ''))}.md`,
      makeMd(
        {
          order: n,
          indicator,
          categories: splitList(row.Category || row.category),
          geography: trim(row.Geography || row.geography),
          sample_interpretation: trim(row['Sample Interpretation'] || row.sample_interpretation),
          source: trim(row.Source || row.source),
        },
        trim(row.Description || row.description),
      ),
    );
  }
  console.log(`  ${n} entries`);
}

async function importCounties() {
  console.log('• Counties with factsheets');
  const rows = await fetchCsv('1862778319');
  const counties = rows.map((r) => trim(r.county || r.County)).filter(Boolean);
  const file = join(DATA_DIR, 'counties-with-factsheets.yml');
  await mkdir(dirname(file), { recursive: true });
  const lines = ['counties:'];
  for (const c of counties) lines.push(`  - ${quoted(c)}`);
  await writeFile(file, lines.join('\n') + '\n', 'utf8');
  console.log(`  ${counties.length} counties`);
}

async function importSummary() {
  console.log('• Summary stats (FancyBoxes)');
  const rows = await fetchCsv('360206538');
  const cleaned = rows
    .map((r) => Object.fromEntries(Object.entries(r).map(([k, v]) => [k.trim(), trim(v)])))
    .filter((r) => Object.values(r).some(Boolean));
  const file = join(DATA_DIR, 'summary-stats.yml');
  await mkdir(dirname(file), { recursive: true });
  const lines = ['rows:'];
  for (const r of cleaned) {
    const entries = Object.entries(r);
    lines.push(`  - ${entries[0][0]}: ${quoted(entries[0][1])}`);
    for (const [k, v] of entries.slice(1)) {
      lines.push(`    ${k}: ${quoted(v)}`);
    }
  }
  await writeFile(file, lines.join('\n') + '\n', 'utf8');
  console.log(`  ${cleaned.length} rows`);
}

// ---- main ------------------------------------------------------------------

async function main() {
  console.log(`Importing into ${DATA_DIR}\n`);
  await mkdir(DATA_DIR, { recursive: true });

  await importFaqs();

  // Research collection is shared across three tabs — wipe before reimport
  await rm(join(DATA_DIR, 'research'), { recursive: true, force: true });
  await importResearchTab('research', '1832548192');
  await importResearchTab('newsroom', '585683908');
  await importResearchTab('toolkits', '752333021');

  await importTeam();
  await importPartners();
  await importResources();
  await importIndicators();
  await importCounties();
  await importSummary();

  console.log('\nDone. content/data/ is the editable source of truth.');
  console.log('Run `yarn content:build` (or `yarn build`) to regenerate src/generated/*.json.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
