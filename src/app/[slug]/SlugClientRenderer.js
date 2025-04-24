
'use client';
import React from 'react';
import Home from '@content/Home.mdx';
import Impact from '@content/Impact.mdx';
import PressCoverage from '@content/PressCoverage.mdx';
import AdditionalResources from '@content/AdditionalResources.mdx';
import Contact from '@content/Contact.mdx';
import TechnicalDocumentation from '@content/TechnicalDocumentation.mdx';
import OurData from '@content/OurData.mdx';
import OurTeam from '@content/OurTeam.mdx';

export default function SlugClientRenderer({ slug }) {
  const pages = {
    home: Home,
    impact: Impact,
    'press-coverage': PressCoverage,
    'additional-resources': AdditionalResources,
    contact: Contact,
    'technical-documentation': TechnicalDocumentation,
    'our-data': OurData,
    'our-team': OurTeam,
  };
  const Content = pages[slug];
  if (!Content) return null;
  return <Content />;
}
