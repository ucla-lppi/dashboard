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
  images: [{ url: 'https://latinoclimatehealth.org/images/LCHD-fb-linkedin.png', width: 1200, height: 628, alt: 'Latino Climate and Health Dashboard preview' }],
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
        {/* Initial inline loader to mask layout before CSS/fonts load */}
        <div
          id="initial-loader"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#004266',
            fontFamily: 'var(--font-lexend-deca), Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
            // ensure no pointer interactions leak through
            pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg
              width="70"
              height="70"
              viewBox="0 0 50 50"
              aria-hidden="true"
              style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.3))' }}
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="5"
              />
              <circle
                cx="25"
                cy="25"
                r="20"
                fill="none"
                stroke="#ffffff"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="31.4 94.2"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 25 25"
                  to="360 25 25"
                  dur="0.9s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            <div
              style={{
                marginTop: '12px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'none',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0px' }}>
                <style>{`
                  .inline-ellipsis { display:inline-flex; align-items:center; gap:0px; }
                  .inline-ellipsis__dot { display:inline-block; color:#ffffff; opacity:0.28; font-weight:700; font-size:13px; line-height:1; transform:translateY(0); animation:ie-pulse 1.05s infinite ease-in-out; margin-left:0; }
                  .inline-ellipsis__dot:nth-child(1) { animation-delay: 0s; }
                  .inline-ellipsis__dot:nth-child(2) { animation-delay: 0.18s; }
                  .inline-ellipsis__dot:nth-child(3) { animation-delay: 0.36s; }
                  @keyframes ie-pulse { 0% { opacity:0.28; transform:translateY(0);} 50% { opacity:1; transform:translateY(-2px);} 100% { opacity:0.28; transform:translateY(0);} }
                `}</style>
                <span style={{ whiteSpace: 'nowrap' }}>
                  <span>Loading</span>
                  <span className="inline-ellipsis" aria-hidden="true" style={{ verticalAlign: 'middle' }}>
                    <span className="inline-ellipsis__dot">.</span>
                    <span className="inline-ellipsis__dot">.</span>
                    <span className="inline-ellipsis__dot">.</span>
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* All interactive UI, data providers, nav, and scripts live in the client shell */}
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}