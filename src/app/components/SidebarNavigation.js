"use client";
import React, { useState } from "react";
import styles from "./SidebarNavigation.module.css";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SidebarNavigation({ sidebarOpen, setSidebarOpen, isMobile }) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const current = segments[0] || '';
  const [impactOpen, setImpactOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

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
            src="/images/ucla_lppi_dashboard_logo.svg"
            alt="UCLA Luskin"
            className="w-[798px] h-auto object-cover mb-4 pointer-events-none"
          />
        </Link>
        <ul className="space-y-2 font-medium">
          {/* Home */}
          <li>
            <Link
              href="/"
              className={`${styles.menuItem} ${(current === '' || current === 'home') ? styles.menuItemActive : ''} text-xl font-bold uppercase flex items-center w-full p-2`}
            >
              HOME
            </Link>
          </li>
          {/* Impact Section */}
          <li>
            <button
              type="button"
              onClick={() => { setImpactOpen((prev) => !prev); setAboutOpen(false); }}
              className={`${styles.menuItem} text-xl font-bold uppercase flex items-center justify-between w-full p-2`}
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
            <ul className={`${impactOpen ? "block" : "hidden"} py-2 space-y-2`}>
              <li>
                <Link href="/research" className={`${styles.menuItem} text-lg font-bold uppercase block w-full p-2 pl-3 ${current === 'research' ? styles.menuItemActive : ''}`}>
                  Research
                </Link>
              </li>
              <li>
                <Link href="/press-coverage" className={`${styles.menuItem} text-lg font-bold uppercase block w-full p-2 pl-3 ${current === 'press-coverage' ? styles.menuItemActive : ''}`}>
                  PRESS COVERAGE
                </Link>
              </li>
              <li>
                <Link href="/partners" className={`${styles.menuItem} text-lg font-bold uppercase block w-full p-2 pl-3 ${current === 'partners' ? styles.menuItemActive : ''}`}>
                  PARTNERS
                </Link>
              </li>
              <li>
                <Link href="/policy-toolkit" className={`${styles.menuItem} text-lg font-bold uppercase block w-full p-2 pl-3 ${current === 'policy-toolkit' ? styles.menuItemActive : ''}`}>
                  POLICY TOOLKIT
                </Link>
              </li>
            </ul>
          </li>
          {/* About Section */}
          <li>
            <button
              type="button"
              onClick={() => { setAboutOpen((prev) => !prev); setImpactOpen(false); }}
              className={`${styles.menuItem} text-xl font-bold uppercase flex items-center justify-between w-full p-2`}
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
            <ul className={`${aboutOpen ? "block" : "hidden"} py-2 space-y-2 pl-3`}>
              <li>
                <Link href="/faqs" className={`${styles.menuItem} text-lg font-bold uppercase block w-full p-2 pl-3 ${current === 'faqs' ? styles.menuItemActive : ''}`}>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/our-data" className={`${styles.menuItem} text-lg font-bold uppercase block w-full p-2 pl-3 ${current === 'our-data' ? styles.menuItemActive : ''}`}>
                  OUR DATA
                </Link>
              </li>
              <li>
                <Link href="/technical-documentation" className={`${styles.menuItem} text-lg font-bold uppercase block w-full p-2 pl-3 ${current === 'technical-documentation' ? styles.menuItemActive : ''}`}>
                  TECHNICAL DOCUMENTATION
                </Link>
              </li>
              <li>
                <Link href="/our-team" className={`${styles.menuItem} text-lg font-bold uppercase block w-full p-2 pl-3 ${current === 'our-team' ? styles.menuItemActive : ''}`}>
                  OUR TEAM
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`${styles.menuItem} text-lg font-bold uppercase block w-full p-2 pl-3 ${current === 'contact' ? styles.menuItemActive : ''}`}>
                  CONTACT
                </Link>
              </li>
            </ul>
          </li>
          {/* Additional Resources */}
          <li>
            <Link href="/additional-resources" className={`${styles.menuItem} ${current === 'additional-resources' ? styles.menuItemActive : ''} text-xl font-bold uppercase block w-full p-2`}>
              ADDITIONAL RESOURCES
            </Link>
          </li>
        </ul>
      </div>

      {/* Social Section */}
      <div className="px-3 py-4 bg-white-100">
        <div className="text-center text-sm font-bold mb-2">Connect with us!</div>
        <div className="flex justify-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="/images/fb_sidebar.svg" alt="Facebook" className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="/images/yt_sidebar.svg" alt="YouTube" className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="/images/ig_sidebar.svg" alt="Instagram" className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="/images/twitter_sidebar.svg" alt="Twitter" className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="/images/linkedin_sidebar.svg" alt="LinkedIn" className="w-5 h-5" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200">
            <img src="/images/email_sidebar.svg" alt="Email" className="w-5 h-5" />
          </div>
        </div>
      </div>
    </aside>
  );
}