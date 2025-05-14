"use client";
import { Lexend_Deca } from 'next/font/google';
import HomePage from './components/HomePage';
import { Card } from 'flowbite-react';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-lexend-deca',
});

export default function Home({ children }) {
  return (
    <main className={`${lexendDeca.className} flex flex-col min-h-screen`}>      
      <Card className="flex-grow bg-[#fcfcfc] dark:bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-full border-0">
        <HomePage />
      </Card>
    </main>
  );
}