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
  const [sortAsc, setSortAsc] = useState(false);
  const { getDataForUrl, setDataForUrl } = useDataContext();

  // Load and cache CSV data, reuse if available
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const cached = getDataForUrl(csvUrl);
      function parseDateLocal(raw) {
        if (!raw) return new Date();
        if (raw instanceof Date) return raw;
        const s = String(raw).trim();
        const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
        if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
        const md = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        if (md) return new Date(Number(md[3]), Number(md[1]) - 1, Number(md[2]));
        const d = new Date(s);
        if (isNaN(d)) return new Date();
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      }

      const process = (data) => {
        const mapped = data
          .map((item, idx) => {
            const rawSub = item.subcategory || item.Subcategory || '';
            return ({
              id: item.id || item.ID || idx,
              title: item.Title || item.title || '',
              summary: item.summary || item.Summary || item.Description || item.description || '',
              image_link: item.File || item.file || item.image_link || item.Image || '',
              date: item.date ? parseDateLocal(item.date) : new Date(),
              subcategory: normalizeKey(rawSub),
              link: item.link || item.Link || '#',
              readTime: item.readTime || item['Read time'] || item.ReadTime || '',
              keywords: (item.keywords || item.Keywords || '').split(',').map(k=>k.trim()).filter(Boolean),
              outlet: item.outlet || item.Outlet || item['outlet'] || ''
            });
          })
          .filter(i => i.title && i.image_link && normalizeKey(subcategory) === i.subcategory)
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
    setFilteredItems(result);
  }, [search, items]);

  const displayItems = filteredItems;

  // Human-readable subcategory label
  const lowercaseWords = ['and','or','for','of','in','to','with','a','an','the'];
  const displaySub = subcategory
    .replace(/[_-]/g, ' ')
    .split(' ')
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (idx > 0 && lowercaseWords.includes(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');

  return (
    <aside className="py-8 bg-white">
      <div className="container px-4 max-w-7xl">
        {/* Main page heading with back button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="block md:hidden text-primary hover:text-primary/80">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-3xl font-bold text-primary">{mainHeading}</h2>
          </div>
        </div>
        
        {/* Desktop: Subcategory and controls row: 25%/1fr/15% */}
        <div className="hidden md:grid grid-cols-[25%_1fr_15%] items-center gap-x-6 mb-6">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">{displaySub}</h3>

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
          {/* Sort toggle cell */}
          <div className="flex justify-end">
            <button
              onClick={() => setSortAsc(prev => !prev)}
              className="flex items-center bg-white text-[#005587] rounded-full border border-primary w-full max-w-[12rem]"
            >
              <span className="flex-1 px-4 py-2 text-base font-normal text-center">
                Sort
              </span>
              <span className="flex items-center justify-center w-10 h-10 bg-[#005587] rounded-r-full">
                <img
                  src={`${prefix}/images/descending.svg`}
                  alt="Sort"
                  className={`w-4 h-4 transform ${sortAsc ? 'rotate-180' : ''}`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile: Subcategory heading and controls */}
        <div className="block md:hidden mb-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-900">{displaySub}</h3>
          <div className="space-y-3">
            {/* Search */}
            <div className="flex items-center bg-white border border-[#1b3f60] rounded-full h-[30px]">
              <input
                type="text"
                placeholder="Search for title, tag, or keyword"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 h-full pl-6 pr-2 text-sm font-lexend-lite text-[#1B3F60] placeholder-[#1B3F60]/80 bg-transparent rounded-l-full focus:outline-none"
              />
              <span className="flex items-center justify-center w-10 h-full bg-[#1B3F60] rounded-r-full">
                <img src={`${prefix}/images/search_icon.svg`} alt="Search" className="w-4 h-4" />
              </span>
            </div>
            {/* Sort */}
            <button
              onClick={() => setSortAsc(prev => !prev)}
              className="flex items-center bg-white text-[#1b3f60] rounded-full border border-[#1b3f60] w-full h-[30px]"
            >
              <span className="flex-1 px-4 text-sm font-normal text-center">
                {sortAsc ? 'Oldest' : 'Newest'}
              </span>
              <span className="flex items-center justify-center w-10 h-full bg-[#1b3f60] rounded-r-full">
                <img
                  src={`${prefix}/images/descending.svg`}
                  alt="Sort"
                  className={`w-4 h-4 transform ${sortAsc ? 'rotate-180' : ''}`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Cards list */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Mobile single-column list */}
            <div className="block md:hidden space-y-4">
              {displayItems.map(item => (
                <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
                  {/* Image on the left */}
                  <div className="flex-shrink-0 w-24 h-24">
                    <img src={item.image_link || '/images/placeholder.png'} alt={item.title || 'Image'} className="w-full h-full object-cover rounded" />
                  </div>
                  {/* Content on the right */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <p className="text-sm text-gray-900 font-medium line-clamp-3 mb-2">{item.title}</p>
                      {item.outlet && (
                        <span className="inline-block text-gray-700 text-xs font-medium rounded-full px-3 py-1" style={{backgroundColor: '#aec8c3'}}>{item.outlet}</span>
                      )}
                    </div>
                    <div className="flex justify-end mt-2">
                      <img src={`${prefix}/images/external_link.svg`} alt="External link" className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
            
            {/* Desktop horizontal rows */}
            <div className="hidden md:block space-y-6">
              {displayItems.map(item => (
                <article key={item.id} className="relative shadow border border-gray-200 pt-4 pb-8 pl-4 pr-12 flex items-start transform transition-transform duration-200 hover:-translate-y-[5px]">
                  {/* Date badge absolute top-right */}
                  <span className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-base font-normal">
                    {`${item.date.getMonth() + 1}/${item.date.getDate()}/${item.date.getFullYear()}`}
                  </span>
                  {/* Image */}
                  <img
                    src={item.image_link || '/images/placeholder.png'}
                    alt={item.title || 'Image'}
                    className="w-[200px] h-[150px] object-cover mr-4 flex-shrink-0"
                  />
                  {/* Content */}
                  <div className="flex-1">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="flex flex-col items-start mb-6 pr-16">
                        <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                        {item.outlet && (
                          <span className="inline-block text-gray-700 text-xs font-medium rounded-full px-3 py-1 mt-2" style={{backgroundColor: '#aec8c3'}}>{item.outlet}</span>
                        )}
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
          </>
        )}
      </div>
    </aside>
  );
}