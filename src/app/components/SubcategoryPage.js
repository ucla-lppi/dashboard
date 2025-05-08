"use client";
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { useDataContext } from '@/app/context/DataContext';
const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

// Helper to normalize keys for comparison
const normalizeKey = str => str?.toString().toLowerCase().replace(/[-\s]/g, '_');

export default function SubcategoryPage({ csvUrl, subcategory, mainHeading }) {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeKeyword, setActiveKeyword] = useState(null);
  const [sortAsc, setSortAsc] = useState(false);
  const { getDataForUrl, setDataForUrl } = useDataContext();

  // Load and cache CSV data, reuse if available
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const cached = getDataForUrl(csvUrl);
      const process = (data) => {
        const mapped = data
          .map((item, idx) => {
            const rawSub = item.subcategory || item.Subcategory || '';
            return ({
              id: item.id || item.ID || idx,
              title: item.Title || item.title || '',
              summary: item.summary || item.Summary || item.Description || item.description || '',
              imageUrl: item.File || item.file || item.imageUrl || item.Image || '',
              date: item.date ? new Date(item.date) : new Date(),
              subcategory: normalizeKey(rawSub),
              link: item.link || item.Link || '#',
              readTime: item.readTime || item['Read time'] || item.ReadTime || '',
              keywords: (item.keywords || item.Keywords || '').split(',').map(k=>k.trim()).filter(Boolean)
            });
          })
          .filter(i => i.title && i.imageUrl && normalizeKey(subcategory) === i.subcategory)
          .sort((a, b) => sortAsc ? a.date - b.date : b.date - a.date);
        setItems(mapped);
        setFilteredItems(mapped);
        setLoading(false);
      };
      if (cached) {
        process(cached);
      } else {
        try {
          const res = await fetch(csvUrl);
          const text = await res.text();
          Papa.parse(text, {
            header: true,
            complete: ({ data, errors }) => {
              if (errors.length) { setLoading(false); return; }
              setDataForUrl(csvUrl, data);
              process(data);
            }
          });
        } catch {
          setLoading(false);
        }
      }
    };
    loadData();
  }, [csvUrl, subcategory, sortAsc]);

  // Compute list of all keywords
  const allKeywords = Array.from(new Set(items.flatMap(i => i.keywords))).sort();

  // Real-time search filtering
  useEffect(() => {
    const q = search.toLowerCase();
    let result = items.filter(i => i.title.toLowerCase().includes(q));
    if (activeKeyword) result = result.filter(i => i.keywords.includes(activeKeyword));
    setFilteredItems(result);
  }, [search, items, activeKeyword]);

  const displayItems = filteredItems;

  // Human-readable subcategory label
  const displaySub = subcategory.replace(/[_-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <aside className="py-8 bg-white">
      <div className="container px-4 mx-auto max-w-4xl pb-8">
        {/* Main page heading */}
        <div className="mb-4">
          <h2 className="text-[28px] font-bold text-primary">{mainHeading}</h2>
        </div>
        {/* Subcategory and controls row: 25%/1fr/15% */}
        <div className="grid grid-cols-[25%_1fr_15%] items-center gap-x-6 mb-6">
          <h3 className="self-center text-xl font-bold text-gray-900">{displaySub}</h3>

          {/* Search cell */}
          <div className="flex justify-end">
            <div className="flex items-center bg-white rounded-full border border-primary w-full max-w-[22rem]">
              <input
                type="text"
                placeholder="Search for title, tag, or keyword"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 pl-4 pr-2 py-2 text-base font-lexend-lite placeholder-[#005587]/80 text-[#005587] bg-transparent rounded-l-full focus:outline-none"
              />
              <span className="flex items-center justify-center w-10 h-10 bg-primary rounded-r-full">
                <img src={`${prefix}/images/search_icon.svg`} alt="Search" className="w-4 h-4" />
              </span>
            </div>
          </div>
          {/* Filter cell */}
          <div className="flex justify-end relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center bg-white text-[#005587] rounded-full border border-primary w-full max-w-[12rem]"
            >
              <span className="flex-1 px-4 py-2 text-base font-normal text-center">Filter</span>
              <span className="flex items-center justify-center w-10 h-10 bg-[#005587] rounded-r-full">
                <img
                  src={`${prefix}/images/descending.svg`}
                  alt="Sort"
                  className={`w-4 h-4 transform ${sortAsc ? 'rotate-180' : ''}`}
                />
              </span>
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg p-4 w-48 z-50">
                {allKeywords.map(kw => (
                  <button
                    key={kw}
                    onClick={() => { setActiveKeyword(activeKeyword === kw ? null : kw); setShowFilters(false); }}
                    className="block w-full text-left text-base px-2 py-1 hover:bg-gray-100 z-50"
                  >
                    {'#' + kw}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cards list as horizontal rows */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6">
            {displayItems.map(item => (
              <article key={item.id} className="relative shadow border border-gray-200 pt-4 pb-8 pl-4 pr-12 flex items-start transform transition-transform duration-200 hover:-translate-y-[5px]">
                {/* Date badge absolute top-right */}
                <span className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-base font-normal">
                  {`${item.date.getMonth() + 1}/${item.date.getDate()}/${item.date.getFullYear()}`}
                </span>
                {/* Image */}
                <img
                  src={item.imageUrl || '/images/placeholder.png'}
                  alt={item.title || 'Image'}
                  className="w-[200px] h-[150px] object-cover mr-4 flex-shrink-0"
                />
                {/* Content */}
                <div className="flex-1">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex items-center mb-6 pr-16">
                      <h3 className="flex-1 text-base font-bold text-gray-900">{item.title}</h3>
                    </div>
                    {item.summary && <p className="text-base font-normal text-gray-700 mt-4">{item.summary}</p>}
                  </a>
                  {/* Keyword tags as text links */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.keywords.sort().map(kw => (
                      <a
                        key={kw}
                        onClick={() => setActiveKeyword(activeKeyword === kw ? null : kw)}
                        className={`text-base font-normal text-primary hover:underline cursor-pointer${
                          activeKeyword === kw ? ' font-bold' : ''
                        }`}
                      >
                        {'#' + kw}
                      </a>
                    ))}
                  </div>
                {/* External link icon */}
                <img src={`${prefix}/images/external_link.svg`} alt="External link" className="w-4 h-4 absolute bottom-2 right-2" />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}