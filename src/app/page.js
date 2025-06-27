"use client";
import Head from 'next/head';
import { Lexend_Deca } from 'next/font/google';
import HomePage from './components/HomePage';
import { Card } from 'flowbite-react';
import CaliforniaCountyProfiles from './components/CaliforniaCountyProfiles';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-lexend-deca',
});
const prefix   = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
const origin   = (typeof window !== 'undefined' && window.location.origin) || 'https://latinoclimatehealth.org';
const imageUrl = `${origin}${prefix}/images/LCHD-fb-linkedin.png`;

export default function Home({ children }) {
  return (
    <>
      <Head>
        <title>Latino Climate and Health Dashboard</title>
        <meta
          name="description"
          content="Interactive map and county factsheets for California’s Latino communities’ climate & health statistics."
        />
        {/* Open Graph */}
        <meta property="og:title"       content="Latino Climate and Health Dashboard" />
        <meta property="og:description" content="Interactive map and county factsheets…" />
        <meta property="og:image"       content={imageUrl} />
        <meta property="og:image:alt"   content="Latino Climate and Health Dashboard preview" />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Latino Climate and Health Dashboard" />
        <meta name="twitter:description" content="Interactive map and county factsheets…" />
        <meta name="twitter:image"       content={imageUrl} />
        <meta name="twitter:image:alt"   content="Latino Climate and Health Dashboard preview" />
      </Head>
      <main className={`${lexendDeca.className} flex flex-col space-y-6 min-h-screen`}>      
        <Card className="flex-grow bg-[#fcfcfc] dark:bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-full border-0">
          <HomePage />

        </Card>
        <Card
          className="flex-grow bg-[#fcfcfc] dark:bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-full border-0"
          id="county-profiles"
        >
          <CaliforniaCountyProfiles />
          {/* Jump to Top: left-aligned block with centered inner items */}
          <div className="mt-4 flex flex-col items-start">
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="text-m font-semibold text-black"
              >
                jump to top
              </button>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-tertiary text-white p-3 rounded-full shadow-md"
                aria-label="Go up"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform -rotate-90" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}