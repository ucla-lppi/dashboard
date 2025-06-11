"use client";
import React, { useState } from "react";
import styles from "./SidebarNavigation.module.css";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ResearchSection from './ResearchSection';

export default function SidebarNavigation({ sidebarOpen, setSidebarOpen, isMobile }) {
  // Determine asset prefix (e.g. '/dashboard')
  const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const section = segments[0] || '';
  const subSection = segments[1] || '';
  // Highlight Research main link when viewing its subcategory pages
  const researchSubs = ['data-for-action','community-research','policy-focused'];
  const isResearchSub = researchSubs.includes(section);

  const [impactOpen, setImpactOpen] = useState(section === 'impact' || isResearchSub);
  const [aboutOpen, setAboutOpen] = useState(
    ['faqs','our-data','our-team','technical-documentation','resource-bank'].includes(section)
  );

  return (
    <aside
      id="logo-sidebar"
      className={`fixed top-0 left-0 z-[9999] w-64 min-h-screen bg-white shadow-[4px_0px_0px_rgba(25,73,88,0.50)]
        flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="px-3 py-4 bg-white">
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
        <Link href="/" className="text-xl font-bold uppercase block w-full p-2">
          <img
            src={`${prefix}/images/ucla_lppi_dashboard_logo.svg`}
            alt="UCLA Luskin"
            className="w-[798px] h-auto object-cover mb-4 pointer-events-none"
          />
        </Link>
        <ul className="space-y-2 font-medium">
          {/* Home */}
          <li>
            <Link
              href="/"
              onClick={() => { setAboutOpen(false); setImpactOpen(false); }}
              className={`${styles.menuItem} ${(!section || section === 'home') ? styles.menuItemActive : ''} text-xl font-bold uppercase flex items-center w-full p-2`}
            >
              HOME
            </Link>
          </li>
          {/* Impact Section */}
          <li>
            <button
              type="button"
              onClick={() => { setImpactOpen((prev) => !prev); setAboutOpen(false); }}
              className={`${styles.menuItem} text-xl font-bold uppercase flex items-center justify-between w-full p-2 ${section === 'impact' ? styles.menuItemActive : ''}`}
            >
              IMPACT
              <svg
                className={`w-3 h-3 transform transition-transform duration-300 ${
                  impactOpen ? "rotate-0" : "rotate-180"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div className={`${impactOpen ? "block relative py-2 pl-8" : "hidden"}`}>  
              <div className="absolute left-3 top-4 bottom-2 w-px bg-primary" aria-hidden="true" />
              <ul className="space-y-2">  
                <li>
                  <Link href="/impact/research" className={`${styles.menuItem} text-xl font-bold uppercase block w-full p-2 ${(subSection === 'research' || isResearchSub) ? styles.submenuItemActive : ''}`}>
                    Research
                  </Link>
                </li>
                <li>
                  <Link href="/impact/newsroom" className={`${styles.menuItem} text-xl font-bold uppercase block w-full p-2 ${subSection === 'newsroom' ? styles.submenuItemActive : ''}`}>
                    Newsroom
                  </Link>
                </li>
                <li>
                  <Link href="/impact/partners" className={`${styles.menuItem} text-xl font-bold uppercase block w-full p-2 ${subSection === 'partners' ? styles.submenuItemActive : ''}`}>
                    Partners
                  </Link>
                </li>
                <li>
                  <Link href="/policy-toolkit" className={`${styles.menuItem} text-xl font-bold uppercase block w-full p-2 ${section === 'policy-toolkit' ? styles.submenuItemActive : ''}`}>
                    POLICY TOOLKIT
                  </Link>
                </li>
              </ul>
            </div>
          </li>
          {/* About Section */}
          <li>
            <button
              type="button"
              onClick={() => { setAboutOpen((prev) => !prev); setImpactOpen(false); }}
              className={`${styles.menuItem} text-xl font-bold uppercase flex items-center justify-between w-full p-2 ${aboutOpen ? styles.menuItemActive : ''}`}
            >
              ABOUT
              <svg
                className={`w-3 h-3 transform transition-transform duration-300 ${
                  aboutOpen ? "rotate-0" : "rotate-180"
                }`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div className={`${aboutOpen ? "block relative py-2 pl-8" : "hidden"}`}>  
              <div className="absolute left-3 top-4 bottom-2 w-px bg-primary" aria-hidden="true" />
              <ul className="space-y-2">
                <li>
                  <Link href="/faqs" className={`${styles.menuItem} text-xl font-bold uppercase block w-full p-2 ${section === 'faqs' ? styles.submenuItemActive : ''}`}>
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href={`/our-data`} className={`${styles.menuItem} text-xl font-bold uppercase block w-full p-2 ${section === 'our-data' ? styles.submenuItemActive : ''}`}>
                    OUR DATA
                  </Link>
                </li>
                <li>
                  <Link href="/about/our-team" className={`${styles.menuItem} text-xl font-bold uppercase block w-full p-2 ${(section === 'about' && subSection === 'our-team') ? styles.submenuItemActive : ''}`}>
                    OUR TEAM
                  </Link>
                </li>
                <li>
                  <a
                    href="https://latino.ucla.edu/research/climate-health-dashboard-technical-doc/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.menuItem} text-xl font-bold uppercase flex items-center w-full p-2`}
                  >
                    <span className="flex-1">TECHNICAL DOCUMENTATION</span>
                    {/* <img
                      src={`${prefix}/img/external-link.svg`}
                      alt="External link"
                      className="w-4 h-4 ml-2 flex-shrink-0"
                    /> */}
                  </a>
                </li>
              </ul>
            </div>
          </li>
          {/* RESOURCE DIRECTORY */}
          <li>
            <Link href="/resource-directory" className={`${styles.menuItem} ${section === 'resource-directory' ? styles.menuItemActive : ''} text-xl font-bold uppercase block w-full p-2`}>
              RESOURCE DIRECTORY
            </Link>
          </li>
        </ul>
      </div>

      {/* Social Section */}
      <div className="px-3 py-4 bg-white-100">
        <div className="text-center text-sm font-bold mb-2">Connect with us!</div>
        <div className="flex justify-center space-x-2">
          <a href="https://www.facebook.com/UCLAlatino" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src={`${prefix}/images/fb_sidebar.svg`} alt="Facebook" className="w-5 h-5" />
          </a>
          <a href="https://www.youtube.com/channel/UC8EWEUYQjs8izWDyPM77hUw" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src={`${prefix}/images/yt_sidebar.svg`} alt="YouTube" className="w-5 h-5" />
          </a>
          <a href="https://www.instagram.com/uclalppi/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src={`${prefix}/images/ig_sidebar.svg`} alt="Instagram" className="w-5 h-5" />
          </a>
          <a href="https://x.com/UCLAlatino" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src={`${prefix}/images/twitter_sidebar.svg`} alt="Twitter" className="w-5 h-5" />
          </a>
          <a href="https://www.linkedin.com/company/uclalatino/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src={`${prefix}/images/linkedin_sidebar.svg`} alt="LinkedIn" className="w-5 h-5" />
          </a>
          <a href="mailto:latino@luskin.ucla.edu" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src={`${prefix}/images/email_sidebar.svg`} alt="Email" className="w-5 h-5" />
          </a>
        </div>
      </div>
    </aside>
  );
}