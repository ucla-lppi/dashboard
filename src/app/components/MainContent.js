"use client";
import React from "react";
import { Card } from "flowbite-react";

// Import MDX components via the @content alias
import HomePage from "../components/HomePage";

import Research from "@content/Research.mdx";
import AdditionalResources from "@content/AdditionalResources.mdx";
import Contact from "@content/Contact.mdx";
import PressCoverage from "@content/PressCoverage.mdx";
import TechnicalDocumentation from "@content/TechnicalDocumentation.mdx";
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
  PressCoverage,
  TechnicalDocumentation,
  OurData,
  OurTeam,
  FAQ,
};

export default function MainContent({ activeItem }) {
  const ContentComponent =
    components[activeItem] || (() => <div>Page not found.</div>);
  const isMDX = activeItem !== "Home";

  return (
    <Card className="bg-[#fcfcfc] dark:bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0">
      {isMDX ? (
        <article className="prose lg:prose-xl">
          <ContentComponent />
        </article>
      ) : (
        <ContentComponent />
      )}
    </Card>
  );
}