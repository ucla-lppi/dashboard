"use client";

import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import Papa from 'papaparse';
import { useDataContext } from '@/app/context/DataContext';
import Link from 'next/link';

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=494687510&single=true&output=csv';
const slugify = str =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

export default function ResourceDirectoryPage() {
  const [activeId, setActiveId] = useState('');
  const { getDataForUrl, setDataForUrl } = useDataContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch & cache CSV
  useEffect(() => {
    const cached = getDataForUrl(CSV_URL);
    const process = data => {
      setItems(
        data.map((row, i) => ({
          id: i,
          category: row.Category || '',
          abbreviation: row.Abbreviation || '',
          name: row.Organization || '',
          description: row.Description || '',
          url: row.URL || '',
        }))
      );
      setLoading(false);
    };

    if (cached) {
      process(cached);
    } else {
      fetch(CSV_URL)
        .then(r => r.text())
        .then(txt =>
          Papa.parse(txt, {
            header: true,
            complete: ({ data }) => {
              setDataForUrl(CSV_URL, data);
              process(data);
            },
          })
        )
        .catch(() => setLoading(false));
    }
  }, [getDataForUrl, setDataForUrl]);

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
    <section className="py-8 bg-white">
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
          
           <div className="flex gap-x-12">

             {/* left‐side tree nav */}
            {/* increase nav width to one-third */}
            <nav className="w-1/3 pr-6 pl-6">
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
             </nav>

             {/* right‐side content */}
             <div className="flex-1 px-4">
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
                          className="border rounded p-4 hover:shadow-md"
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
        )}  {/* end loading */}
        </div>  {/* closes the .container div */}
      </section>
    );  // closes the return
}  // closes ResourceDirectoryPage
