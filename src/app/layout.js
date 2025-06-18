"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Lexend_Deca, Lexend_Zetta, La_Belle_Aurore } from 'next/font/google';
import { ThemeModeScript } from 'flowbite-react';
import Footer from './components/Footer';
import SidebarNavigation from './components/SidebarNavigation';
import './styles/globals.css';
import { DataProvider } from './context/DataContext';
import "@fontsource/montserrat/400.css"; // Regular

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
  // Default initial state is true (i.e. sidebar open)
  const [sidebarOpen, setSidebarOpen] = useState(true);
  // New state to detect mobile devices below 540px
  const [isMobile, setIsMobile] = useState(false);

  // Compute base href for relative assets
  const rawPath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const baseClean = rawPath.replace(/^\/+|\/+$/g, '');
  const baseHref = baseClean ? `/${baseClean}/` : '/';

  const mainContentRef = useRef(null);
  const sidebarRef = useRef(null);

  // Toggle sidebar based on mobile detection
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 540);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const adjustHeight = () => {
      if (mainContentRef.current && sidebarRef.current) {
        const sidebarHeight = sidebarRef.current.offsetHeight;
        const mainContentHeight = mainContentRef.current.offsetHeight;

        // Set the main content height to match the sidebar if it's smaller
        if (mainContentHeight < sidebarHeight) {
          mainContentRef.current.style.height = `${sidebarHeight}px`;
        } else {
          mainContentRef.current.style.height = 'auto'; // Reset if main content is larger
        }
      }
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, []);

  return (
    <html
      lang="en"
      className={`${lexendDeca.variable} ${lexendZetta.variable} ${laBelleAurore.variable}`}
      suppressHydrationWarning
    >
      <body className={`${lexendDeca.className}`}>
        <DataProvider>
        <div className="flex flex-col">
          {/* Mobile Header: only rendered when device width is less than 540px */}
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
			<span className="ml-2 text-xl font-bold text-black"></span>
			</a>
		</header>
		)}

          <div className="grid grid-cols-1 sm:grid-cols-[auto] flex-grow h-full">
            {/* Sidebar Navigation Component */}
            <SidebarNavigation sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isMobile={isMobile} />
			{isMobile && (
          	<div
            	className={`fixed inset-0 bg-black z-30 transition-opacity duration-200 ease-in-out ${sidebarOpen ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            	onClick={() => setSidebarOpen(false)}
          	/>
        	)}

            {/* Main Content Section */}
            <div className={`relative p-4 transition-all duration-300 ${!isMobile && sidebarOpen ? 'ml-64' : 'ml-0'} sm:ml-0`}>
              {/* Background Layer */}
              <div className="absolute inset-0 z-[-10] bg-gradient-to-b from-[#004266] to-[#002E45] overflow-hidden pointer-events-none">
				{/* Removed background circles */}
                {/* <img
                  src="/images/bg_circle_top_left.svg"
                  alt="Top left circle"
                  className="absolute top-[50px] left-[-200px]"
                /> */}
                {/* <img
                  src="/images/bg_circle_bottom_right.svg"
                  alt="Bottom right circle"
                  className="absolute bottom-[-350px] right-[-250px]"
                /> */}
              </div>
              {/* Main Content and Children */}
              {children}
            </div>
          </div>
        </div>
        </DataProvider>
        <Footer />
      </body>
    </html>
  );
}