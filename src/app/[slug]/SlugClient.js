"use client";
import React from 'react';
import Link from 'next/link';
import { Card } from 'flowbite-react';

import Impact from '@content/Impact.mdx';
import Research from '@content/Research.mdx';
import Newsroom from '@content/Newsroom.mdx';
import AdditionalResources from '@content/AdditionalResources.mdx';
import Contact from '@content/Contact.mdx';
import OurData from '../our-data/page';
import OurTeam from '@content/OurTeam.mdx';
import HomePage from '../components/HomePage';
import FAQsPage from '../faqs/page';

const components = {
  home: HomePage,
  impact: Impact,
  research: Research,
  'newsroom': Newsroom,
  'additional-resources': AdditionalResources,
  contact: Contact,
  'our-data': OurData,
  'our-team': OurTeam,
  'faq': FAQsPage,
};

export default function SlugClient({ slug }) {
  const Component = components[slug];
  if (!Component) return <div>Page not found.</div>;
  return (
    <Card className="bg-[#fcfcfc] dark:bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0">
      <article className="prose lg:prose-xl">
        <Component />
      </article>
    </Card>
  );
}