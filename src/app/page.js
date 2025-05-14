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
		
        <div className="mt-4 flex justify-start">
          <button
            onClick={() =>
              document
                .getElementById('county-profiles')
                .scrollIntoView({ behavior: 'smooth' })
            }
            className="bg-secondary text-white px-4 py-2 rounded"
          >
            Jump to County Profiles
          </button>
        </div>
      </Card>
      <Card className="flex-grow bg-[#fcfcfc] dark:bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-full border-0" id="county-profiles">
        <CaliforniaCountyProfiles />
		          <div className="mt-4 flex justify-end">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-secondary text-white px-4 py-2 rounded"
            >
              Jump to Top
            </button>
          </div>
      </Card>
    </main>
  );
}