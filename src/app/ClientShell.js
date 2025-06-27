"use client";

import React, { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import { DefaultSeo } from 'next-seo';
import SEO from '../lib/seo.config';
import { DataProvider } from './context/DataContext';
import Footer from './components/Footer';
import SidebarNavigation from './components/SidebarNavigation';

const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-LDM5HW00R6';

export default function ClientShell({ children }) {
  // default SEO meta tags (rendered client-side via next-seo)
  const seoNode = <DefaultSeo {...SEO} />;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 540);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const adjustHeight = () => {
      if (mainContentRef.current && sidebarRef.current) {
        const sidebarHeight = sidebarRef.current.offsetHeight;
        const mainContentHeight = mainContentRef.current.offsetHeight;
        if (mainContentHeight < sidebarHeight) {
          mainContentRef.current.style.height = `${sidebarHeight}px`;
        } else {
          mainContentRef.current.style.height = 'auto';
        }
      }
    };
    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  return (
    <>
      {seoNode}
      {/* Google Analytics */}
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}  
          gtag('js', new Date());  
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}
      </Script>
      <DataProvider>
        <div className="flex flex-col" ref={mainContentRef}>
          {isMobile && (
            <header className="flex items-center justify-between p-4 bg-white shadow">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 bg-transparent border-none cursor-pointer text-3xl text-gray-800"
                aria-label="Toggle sidebar"
              >
                &#9776;
              </button>
              <a href="/" className="flex items-center">
                <img
                  src={`${prefix}/images/ucla_lppi_dashboard_logo.svg`}
                  alt="LPPI Dashboard Logo"
                  className="h-8 pointer-events-none"
                />
              </a>
            </header>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-[auto] flex-grow h-full">
            <SidebarNavigation
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              isMobile={isMobile}
              ref={sidebarRef}
            />
            {isMobile && (
              <div
                className={`fixed inset-0 bg-black z-30 transition-opacity duration-200 ease-in-out ${
                  sidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setSidebarOpen(false)}
              />
            )}
            <div
              className={`relative p-4 transition-all duration-300 ${
                !isMobile && sidebarOpen ? 'ml-64' : 'ml-0'
              } sm:ml-0 flex-grow`}
            >
              {/* Main content placeholder */}
              {children}
            </div>
          </div>
        </div>
        <Footer />
      </DataProvider>
    </>
  );
}
