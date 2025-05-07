"use client";
import React from 'react';
import { Card } from 'flowbite-react';

import Impact from '@content/Impact.mdx';
import Research from '@content/Research.mdx';
import Newsroom from '@content/Newsroom.mdx';
import AdditionalResources from '@content/AdditionalResources.mdx';
import Contact from '@content/Contact.mdx';
import TechnicalDocumentation from '@content/TechnicalDocumentation.mdx';
import OurData from '@content/OurData.mdx';
import OurTeam from '@content/OurTeam.mdx';
import FAQsFromCSV from '../components/FAQsFromCSV';
import HomePage from '../components/HomePage';

const components = {
  home: HomePage,
  impact: Impact,
  research: Research,
  'newsroom': Newsroom,
  'additional-resources': AdditionalResources,
  contact: Contact,
  'technical-documentation': TechnicalDocumentation,
  'our-data': OurData,
  'our-team': OurTeam,
  faqs: ({}) => <FAQsFromCSV csvUrl="https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=1166232289&single=true&output=csv" />,
};

export default function SlugClient({ slug, csvUrl, initialData }) {
  // When FAQ, render preloaded CSV data to avoid client fetch lag
  if (slug === 'faqs') {
    return (
      <Card className="bg-[#fcfcfc] dark:bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0">
		  <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
		  <p>Here is a list of common questions and answers you may have as you explore the Latino Climate and Health Dashboard. Many common questions about the methods and indicators used to develop the Latino Climate and Health Dashboard can be found here or in the “Our Data” [LINK] section. Please refer to the technical report [LINK] for detailed information on our methods and data sources. 
			<br/> <br/>	
		  If you have suggestions for indicators or areas we should include—or are interested in supporting or collaborating on this work—please contact us at latino@luskin.ucla.edu. 
		  </p>
		<FAQsFromCSV csvUrl={csvUrl} initialData={initialData} />
      </Card>
    );
  }
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