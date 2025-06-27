// Server component: basic HTML shell
import './styles/globals.css';
import { Lexend_Deca, Lexend_Zetta, La_Belle_Aurore } from 'next/font/google';
import ClientShell from './ClientShell';

const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

const lexendDeca = Lexend_Deca({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-lexend-deca',
});
const lexendZetta = Lexend_Zetta({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-zetta',
});
const laBelleAurore = La_Belle_Aurore({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-la-belle-aurore',
});

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${lexendDeca.variable} ${lexendZetta.variable} ${laBelleAurore.variable}`}
      suppressHydrationWarning
    >
      <body className={`${lexendDeca.className}`}>        
        {/* All interactive UI, data providers, nav, and scripts live in the client shell */}
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}