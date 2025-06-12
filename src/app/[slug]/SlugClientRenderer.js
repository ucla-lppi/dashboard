'use client';
import React from 'react';

// Removed all .mdx imports
import OurData from '../our-data/page';

export default function SlugClientRenderer({ slug }) {
  const pages = {
    'our-data': OurData,
    // add other non-MDX pages here
  };

  const Content = pages[slug];
  if (!Content) return null;
  return <Content />;
}
