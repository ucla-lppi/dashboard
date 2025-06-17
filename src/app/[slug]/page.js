import SlugClient from './SlugClient';
import { notFound } from 'next/navigation';
import SlugClientRenderer from './SlugClientRenderer';
import SubcategoryPage from '../components/SubcategoryPage';

// List of supported subcategories (add more as needed)
const subcategorySlugs = {
  'data-for-action': {
    label: 'Data for Action',
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=1832548192&single=true&output=csv',
    subcategory: 'data_for_action',
    mainHeading: 'Research',
  },
  'community-research': {
    label: 'Community Research',
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=1832548192&single=true&output=csv',
    subcategory: 'community_research',
    mainHeading: 'Research',
  },
  'policy-focused': {
    label: 'Policy-focused',
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=1832548192&single=true&output=csv',
    subcategory: 'policy-focused',
    mainHeading: 'Research',
  },
  'press-coverage': {
    label: 'Press Coverage',
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=585683908&single=true&output=csv',
    subcategory: 'press_coverage',
    mainHeading: 'Newsroom',
  },
  'partners': {
    label: 'Partners',
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=563435215&single=true&output=csv',
    subcategory: 'partners',
    mainHeading: 'Partners',
  },
};

// Define all valid slug keys for pre-rendering, including dynamic subcategory pages
const slugs = [
  'home', 'impact', 'newsroom', 'additional-resources', 'contact', 'technical-documentation', 'our-data', 'our-team', 'faq',
  // Add dynamic subcategory slugs
  ...Object.keys(subcategorySlugs),
];

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export default async function Page({ params }) {
  const { slug } = params;
  // If the slug matches a subcategory, render the filterable/searchable list
  if (subcategorySlugs[slug]) {
    const { csvUrl, subcategory, mainHeading } = subcategorySlugs[slug];
    return (
      <main className="bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0 p-4 sm:p-6 max-w-screen-xl mx-auto px-4 py-8">
        <SubcategoryPage
          csvUrl={csvUrl}
          subcategory={subcategory}
          mainHeading={mainHeading}
        />
      </main>
    );
  }
  // Render FAQ via SlugClient (client-side fetch in component)
  if (slug === 'faq') {
    return <SlugClient slug={slug} />;
  }
  // Delegate remaining slugs to the client renderer (MDX content uses React context)
  const valid = ['home','impact','newsroom','additional-resources','contact','technical-documentation','our-data','our-team','faq'];
  if (valid.includes(slug)) {
    return <SlugClientRenderer slug={slug} />;
  }
  // Unknown slug → 404
  notFound();
}