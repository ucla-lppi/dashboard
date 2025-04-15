"use client";
import { Lexend_Deca } from 'next/font/google';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-lexend-deca',
});

export default function Home({ children }) {
  return (
    <main className={`${lexendDeca.className}`}>
      {/* ...page-specific content... */}
      {children}
    </main>
  );
}