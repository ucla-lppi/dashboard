import SlugClient from './SlugClient';
import Papa from 'papaparse';
import { notFound } from 'next/navigation';
import SlugClientRenderer from './SlugClientRenderer';

// Define all valid slug keys for pre-rendering
const slugs = [
  'home',
  'impact',
  'newsroom',
  'additional-resources',
  'contact',
  'technical-documentation',
  'our-data',
  'our-team',
  'faqs',
];

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }) {
  const { slug } = params;
  // Render FAQ via SlugClient
  let initialData = [];
  let csvUrl = '';
  if (slug === 'faqs') {
    csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=1166232289&single=true&output=csv";
    const res = await fetch(csvUrl, { cache: 'force-cache' });
    const csvText = await res.text();
    const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    initialData = results.data
      .map(item => ({
        question: item.question?.trim() || item.Question?.trim() || item.Title?.trim() || "",
        answer: item.answer?.trim() || item.Answer?.trim() || item.File?.trim() || "",
        draft: item.draft?.trim() || item.Draft?.trim() || "",
        id: item.id?.trim() || item.ID?.trim() || "",
      }))
      .filter(item => item.draft?.toLowerCase() !== 'yes' && item.question && item.answer);
    return <SlugClient slug={slug} csvUrl={csvUrl} initialData={initialData} />;
  }
  // Delegate remaining slugs to the client renderer (MDX content uses React context)
  const valid = ['home','impact','newsroom','additional-resources','contact','technical-documentation','our-data','our-team'];
  if (valid.includes(slug)) {
    return <SlugClientRenderer slug={slug} />;
  }
  // Unknown slug → 404
  notFound();
}