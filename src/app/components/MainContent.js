"use client";
import React from "react";
import { Card } from "flowbite-react";
import { MDXProvider } from '@mdx-js/react';

// Import MDX components via the @content alias
import HomePage from "../components/HomePage";

import Research from "@content/Research.mdx";
import AdditionalResources from "@content/AdditionalResources.mdx";
import Contact from "@content/Contact.mdx";
import Newsroom from "@content/Newsroom.mdx";
import OurData from "@content/OurData.mdx";
import OurTeam from "@content/OurTeam.mdx";
import FAQ from "@content/FAQ.mdx";
import FAQsFromCSV from '../components/FAQsFromCSV';

// Fixed mapping: include Home and additional MDX pages
const components = {
  Home:HomePage,
  Research,
  AdditionalResources,
  Contact,
  Newsroom,
  OurData,
  OurTeam,
  FAQ,
  FAQsFromCSV,
};

// MDX component overrides
const mdxComponents = {
  img: ({ src, ...props }) => {
    const newSrc = src.startsWith('./images')
      ? src.replace(/^\.\/images/, '/images')
      : src;
    return <img src={newSrc} {...props} />;
  },
};

export default function MainContent({ activeItem }) {
  const ContentComponent =
    components[activeItem] || (() => <div>Page not found.</div>);
  const isMDX = activeItem !== "Home";

  return (
    <Card className="bg-[#fcfcfc] dark:bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0 p-4 sm:p-6">
      {isMDX ? (
        <MDXProvider components={mdxComponents}>
          <article className="prose lg:prose-xl">
            <ContentComponent />
          </article>
        </MDXProvider>
      ) : (
        <ContentComponent />
      )}
    </Card>
  );
}