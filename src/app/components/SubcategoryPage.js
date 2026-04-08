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
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => window.history.back()} className="block md:hidden text-primary hover:text-primary/80">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h2 className="text-3xl font-bold text-[#1B3F60]">{mainHeading}</h2>
              <p className="text-base text-gray-700 mt-0.5">{displaySub}</p>
            </div>
          </div>

          {/* Desktop search + sort inline with heading */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center bg-white rounded-full border border-[#1b3f60] h-10 w-[300px]">
              <input
                type="text"
                placeholder="Search for title, tag, or keyword"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 pl-4 pr-2 text-sm text-[#1B3F60] placeholder-[#1B3F60]/60 bg-transparent rounded-l-full focus:outline-none"
              />
              <span className="flex items-center justify-center w-10 h-full bg-[#1B3F60] rounded-r-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              </span>
            </div>
            <button
              onClick={() => setSortAsc(prev => !prev)}
              className="flex items-center bg-white text-[#1b3f60] rounded-full border border-[#1b3f60] h-10 min-w-[130px]"
            >
              <span className="flex-1 px-4 text-sm font-medium text-center">
                {sortAsc ? 'Oldest' : 'Newest'}
              </span>
              <span className="flex items-center justify-center w-10 h-full bg-[#1b3f60] rounded-r-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24" className={`transform ${sortAsc ? 'rotate-180' : ''}`}>
                  <path d="M4 8h16M4 16h10" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile: search and sort controls */}
        <div className="block md:hidden mb-6 space-y-3">
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
            
            {/* Desktop list rows */}
            <div className="hidden md:block divide-y divide-gray-200">
              {displayItems.map(item => (
                <a key={item.id} href={item.link} target="_blank" rel="noopener noreferrer"
                  className="flex gap-6 py-5 hover:bg-gray-50 transition-colors"
                >
                  {/* Image */}
                  <div className="flex-shrink-0 w-[160px] h-[120px] bg-gray-200">
                    <img
                      src={item.image_link || '/images/placeholder.png'}
                      alt={item.title || 'Image'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    {/* Title + date badge */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-base font-bold text-[#1B3F60] leading-snug">{item.title}</h3>
                      {item.date && !isNaN(item.date) && (
                        <span className="flex-shrink-0 bg-[#1B3F60] text-white text-xs font-medium px-2 py-1">
                          {`${String(item.date.getMonth()+1).padStart(2,'0')}/${String(item.date.getDate()).padStart(2,'0')}/${String(item.date.getFullYear()).slice(-2)}`}
                        </span>
                      )}
                    </div>
                    {/* Summary */}
                    {item.summary && (
                      <p className="text-sm text-gray-700 line-clamp-3 mb-2">{item.summary}</p>
                    )}
                    {/* Keywords as hashtags */}
                    {item.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-x-2 mb-2">
                        {item.keywords.sort().map(kw => (
                          <span key={kw} className="text-sm text-[#1B3F60] font-medium">#{kw}</span>
                        ))}
                      </div>
                    )}
                    {/* Outlet pill */}
                    {item.outlet && (
                      <div className="mb-auto">
                        <span className="inline-block text-gray-700 text-xs font-medium rounded-full px-3 py-1" style={{backgroundColor: '#aec8c3'}}>{item.outlet}</span>
                      </div>
                    )}
                    {/* External link bottom-right */}
                    <div className="flex justify-end mt-auto pt-2">
                      <img src={`${prefix}/images/external_link.svg`} alt="External link" className="w-4 h-4" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
}