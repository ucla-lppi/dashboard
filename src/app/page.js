"use client";
import { Lexend_Deca } from 'next/font/google';
import HomePage from './components/HomePage';
import { Card } from 'flowbite-react';
import CaliforniaCountyProfiles from './components/CaliforniaCountyProfiles';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-lexend-deca',
});

export default function Home({ children }) {
  return (
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
  );
}