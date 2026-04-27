"use client";

import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import Link from 'next/link';
import resourcesData from '@/generated/resources.json';

const slugify = str =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

export default function ResourceDirectoryPage() {
  const [activeId, setActiveId] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 540);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const items = resourcesData.map((row, i) => ({
    id: row.id ?? i,
    category: row.category || '',
    abbreviation: row.abbreviation || '',
    name: row.name || '',
    description: row.description || '',
    url: row.url || '',
  }));
  const loading = false;

  // group by category
  const grouped = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  // highlight nav item on scroll into view
  useEffect(() => {
    const ids = Object.keys(grouped).map(cat => slugify(cat));
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );
    ids.forEach(id => {
      const sec = document.getElementById(id);
      if (sec) observer.observe(sec);
    });
    return () => observer.disconnect();
  }, [grouped]);

  return (
    <main className="bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0 p-4 sm:p-6 max-w-screen-xl mx-auto px-4 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="pl-4 text-3xl font-bold text-primary mb-6">
          Resource Directory
        </h2>
        <p className="pl-4 mb-6 text-base text-black">
          This directory features organizations across California working to protect health and advance climate justice in frontline communities. Know an organization doing work at the climate, environmental justice, and health nexus? Contact us at{' '}
          <Link href="mailto:latino@luskin.ucla.edu" className="text-primary underline">
            latino@luskin.ucla.edu
          </Link>{' '}
          to help us expand this list.
        </p>
        <hr className="pl-4 border-gray-200 mb-4" />

        {loading ? (
          <p className="pl-4">Loading...</p>
        ) : (
          <>
           {/* mobile-only jump TOC */}
          {isMobile && <div className="mb-6 px-4">
            <p className="text-base font-bold text-primary mb-3">Jump to section</p>
            <div className="border-l-2 border-[#C8E0D7] pl-4 space-y-2">
              {Object.keys(grouped).map(cat => {
                const id = slugify(cat);
                return (
                  <a
                    key={cat}
                    href={`#${id}`}
                    className="block text-base font-medium text-black hover:underline"
                  >
                    {cat}
                  </a>
                );
              })}
            </div>
          </div>}

          <div className={isMobile ? 'flex flex-col' : 'flex flex-row gap-x-12'}>

             {/* left‐side tree nav — hidden on mobile */}
            {/* increase nav width to one-third */}
            {!isMobile && <nav className="w-1/3 pr-6 pl-6">
               <ul className="space-y-2 sticky top-28 border-l-2 border-[#C8E0D7] pl-4">
                 {Object.keys(grouped).map(cat => {
                   const id = slugify(cat);
                   return (
                     <li key={cat}>
                       <a
                         href={`#${id}`}
                         className={`
                           block text-base
                           ${activeId === id 
                             ? 'font-bold text-black' 
                             : 'font-medium text-black'}
                           hover:underline
                         `}
                       >
                         {cat}
                       </a>
                     </li>
                   );
                 })}
               </ul>
             </nav>}

             {/* right‐side content */}
             <div className={isMobile ? 'w-full px-4 min-w-0' : 'flex-1 px-4 min-w-0'}>
              {Object.entries(grouped).map(([cat, entries]) => {
                const id = slugify(cat);
                return (
                  <section id={id} key={cat} className="mb-8">
                    <h3 className="text-2xl font-semibold text-[#005587] border-b border-[#84BAA6] pb-2 mb-4">
                      {cat}
                    </h3>
                    <div className="space-y-6">
                      {entries.map(item => (
                        <div
                          key={item.id}
                          className="border rounded p-4 hover:shadow-md break-words"
                        >
                          {item.abbreviation && (
                            <span className="inline-block bg-gray-200 text-xs font-semibold px-2 py-1 rounded">
                              {item.abbreviation}
                            </span>
                          )}
                          <h4 className="mt-2 text-lg font-bold">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-base text-gray-700">
                            {item.description}
                          </p>
                          {item.url && (
                            <Link
                              href={item.url}
                              target="_blank"
                              className="mt-2 inline-block text-primary underline"
                            >
                              Learn More
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
          </>
        )}  {/* end loading */}
        </div>  {/* closes the .container div */}
      </main>
    );  // closes the return
}  // closes ResourceDirectoryPage
