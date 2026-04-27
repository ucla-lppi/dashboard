import SlugClient from './SlugClient';
import { notFound } from 'next/navigation';
import SlugClientRenderer from './SlugClientRenderer';
import SubcategoryPage from '../components/SubcategoryPage';
import researchData from '@/generated/research.json';
import partnersData from '@/generated/partners.json';

// List of supported subcategories (add more as needed)
const subcategorySlugs = {
  'data-for-action': {
    label: 'Data for Action',
    source: 'research',
    subcategory: 'data_for_action',
    mainHeading: 'Research',
  },
  'community-research': {
    label: 'Community Research',
    source: 'research',
    subcategory: 'community_research',
    mainHeading: 'Research',
  },
  'policy-focused': {
    label: 'Policy-focused',
    source: 'research',
    subcategory: 'policy-focused',
    mainHeading: 'Research',
  },
  'press-coverage': {
    label: 'Press Coverage',
    source: 'research',
    subcategory: 'press_coverage',
    mainHeading: 'Newsroom',
  },
  'partners': {
    label: 'Partners',
    source: 'partners',
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
    const { source, subcategory, mainHeading } = subcategorySlugs[slug];
    const items = source === 'partners' ? partnersData : researchData;
    return (
      <main className="bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0 p-4 sm:p-6 max-w-screen-xl mx-auto px-4 py-8">
        <SubcategoryPage
          items={items}
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