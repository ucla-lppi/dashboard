// Server component: basic HTML shell
import './styles/globals.css';
import { Lexend_Deca, Lexend_Zetta, La_Belle_Aurore } from 'next/font/google';
import ClientShell from './ClientShell';

// Use Next.js App Router metadata API (see below)
export const metadata = {
  title: 'UCLA LPPI: Latino Health and Climate Data for California - Insights for Equity',
  description: 'Access comprehensive data on Latino health disparities and climate issues in California. Explore insights to support research, policymaking, and community health initiatives.',
  openGraph: {
    title: 'UCLA LPPI Climate and Health Dashboard',
    description: 'Explore data on Latino health and climate disparities in California',
    url: 'https://latinoclimatehealth.org/',
    images: [{ url: '/images/LCHD-fb-linkedin.png', width: 1200, height: 630, alt: 'Latino Climate and Health Dashboard preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@UCLALPPI',
    creator: '@UCLALPPI',
  },
};

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
      {/* metadata is auto-injected by Next.js, no custom head needed */}
      <body className={`${lexendDeca.className}`}>        
        {/* All interactive UI, data providers, nav, and scripts live in the client shell */}
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}