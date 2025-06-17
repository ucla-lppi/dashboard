'use client';
import React from 'react';
import Home from '@content/Home.mdx';
import Impact from '@content/Impact.mdx';
import Newsroom from '@content/Newsroom.mdx';
import AdditionalResources from '@content/AdditionalResources.mdx';
import Contact from '@content/Contact.mdx';
// import TechnicalDocumentation from '@content/TechnicalDocumentation.mdx'; // now external link
import OurData from '../our-data/page';
import OurTeam from '@content/OurTeam.mdx';
import FAQ from '../faq/page';

export default function SlugClientRenderer({ slug }) {
  const pages = {
    home: Home,
    impact: Impact,
    'newsroom': Newsroom,
    'additional-resources': AdditionalResources,
    contact: Contact,
    // 'technical-documentation': TechnicalDocumentation, // removed, now external
    'our-data': OurData,
    'our-team': OurTeam,
	'faq': FAQ,
  };
  const Content = pages[slug];
  if (!Content) return null;
  return <Content />;
}
