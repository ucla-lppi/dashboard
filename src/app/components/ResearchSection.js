"use client"
import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import { useDataContext } from '@/app/context/DataContext';
import Link from 'next/link';

const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

// Parse date strings from CSV/Google Sheets into a local Date (avoid UTC parsing of YYYY-MM-DD)
function parseDateLocal(raw) {
  if (!raw) return new Date();
  if (raw instanceof Date) return raw;
  const s = String(raw).trim();
  // YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  // MM/DD/YYYY
  const md = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (md) return new Date(Number(md[3]), Number(md[1]) - 1, Number(md[2]));
  // Fallback: try native parse but convert to local-date-only
  const d = new Date(s);
  if (isNaN(d)) return new Date();
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export default function ResearchSection({ csvUrl, mainHeading = 'Research', initialCategory = 'data_for_action', showInitialHeading = true, showSearchFilters = false }) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const { getDataForUrl, setDataForUrl } = useDataContext();

  // Category labels
  const labelMap = {
    data_for_action: 'Data for Action',
    press_coverage: 'Press Coverage',
    partners: 'Partners',
    policy_recommendations: 'Policy Recommendations',
    talking_points_messaging: 'Talking Points & Messaging Guides',
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const cached = getDataForUrl(csvUrl);
      const process = (data) => {
        if (!data) { setLoading(false); return; }
        const mapped = data
          .map((item, idx) => ({
            id: item.id || item.ID || idx,
            title: item.Title || item.title || '',
            description: item.Description || item.description || '',
            image_link: item.File || item.file || item.image_link || item.Image || '',
            date: item.date ? parseDateLocal(item.date) : new Date(),
            subcategory: item.subcategory || item.Subcategory || '',
            link: item.link || item.Link || '#',
            readTime: item.readTime || item['Read time'] || item.ReadTime || '',
            outlet: item.outlet || item.Outlet || item['outlet'] || ''
          }))
          .filter(item => item.title && item.image_link)
          .sort((a, b) => sortAsc ? a.date - b.date : b.date - a.date);
        setArticles(mapped);
        setFilteredArticles(mapped);
        setLoading(false);
      };
      if (cached) {
        process(cached);
      } else {
        try {
          const res = await fetch(csvUrl);
          if (!res.ok) throw new Error(`Failed to load CSV (${res.status})`);
          const text = await res.text();
          Papa.parse(text, {
            header: true,
            complete: ({ data, errors }) => {
              if (errors.length) {
                setError('Error parsing data');
                setLoading(false);
                return;
              }
              setDataForUrl(csvUrl, data);
              process(data);
            }
          });
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    };
    loadData();
  }, [csvUrl, sortAsc]);

  // Real-time search filtering
  useEffect(() => {
    if (!showSearchFilters) {
      setFilteredArticles(articles);
      return;
    }
    const q = search.toLowerCase();
    let result = articles.filter(i => 
      i.title.toLowerCase().includes(q) || 
      (i.description && i.description.toLowerCase().includes(q)) ||
      (i.outlet && i.outlet.toLowerCase().includes(q))
    );
    setFilteredArticles(result);
  }, [search, articles, showSearchFilters]);

  // Subcomponent to render each subcategory with its header, toggle, and layout
  function CategorySection({ label, items, slugKey }) {
    // Display only first 3 items on mobile, 4 on desktop
    const displayItemsMobile = items.slice(0, 3);
    const displayItemsDesktop = items.slice(0, 4);
    const carouselRef = useRef(null);
    const [overflow, setOverflow] = useState(false);
    useEffect(() => {
      const el = carouselRef.current;
      if (el) setOverflow(el.scrollWidth > el.clientWidth);
      const handle = () => el && setOverflow(el.scrollWidth > el.clientWidth);
      window.addEventListener('resize', handle);
      return () => window.removeEventListener('resize', handle);
    }, [items]);
    return (
      <div className="mb-8 pb-8">
        {/* Section content (heading rendered externally) */}
        {/* Mobile single-column list */}
        <div className="block md:hidden space-y-4">
          {displayItemsMobile.map(item => (
            <Link key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="flex gap-4 bg-white p-4 rounded-lg shadow-sm">
              {/* Image on the left */}
              <div className="flex-shrink-0 w-24 h-24">
                <img src={item.image_link} alt={item.title} className="w-full h-full object-cover rounded" />
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
            </Link>
          ))}
        </div>
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
          {displayItemsDesktop.map(item => (
            <Link key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="w-72 bg-white shadow-[0_3px_0_#c5c5c5] relative flex flex-col min-h-[269px] transform transition duration-200 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_5px_0_#c5c5c5]">
              <img src={item.image_link} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <div className="relative mb-2">
                  <h4 className="text-lg font-bold text-gray-900 break-words pr-6">{item.title}</h4>
                  <img src={`${prefix}/images/external_link.svg`} alt="External link" className="w-4 h-4 absolute top-0 right-0" />
                </div>
                {item.outlet && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold rounded-full px-3 py-1 mb-2 whitespace-nowrap w-auto max-w-max">{item.outlet}</span>
                )}
              </div>
            </Link>
          ))}
        </div>
        {/* See all button - shown on mobile when more than 3 items, desktop when more than 4 */}
        {items.length > 3 && (
          <div className="mt-6 flex justify-center md:justify-end items-center">
            <Link href={`/${slugKey}`} aria-label={`View all ${label} items`} className="inline-flex items-center gap-2 bg-primary text-white font-medium px-6 py-3 rounded-full hover:bg-primary/90 focus:outline-none focus:ring transition-all">
              <span>see all</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="py-8 bg-white">
      <div className="container px-4 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">{mainHeading}</h2>
        </div>

        {/* Search and Sort controls - mobile only when showSearchFilters is true */}
        {showSearchFilters && (
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
        )}

        {/* Initial category section */}
        {showInitialHeading && (
          <h3 className="text-xl font-semibold mb-8 text-gray-900">{labelMap[initialCategory]}</h3>
        )}
        {loading && (
          <>
            {/* Mobile skeleton list */}
            <div className="block md:hidden space-y-4">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm animate-pulse">
                  <div className="flex-shrink-0 w-24 h-24 bg-gray-300 rounded"></div>
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-24 mt-2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop skeleton grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
              {[...Array(4)].map((_, idx) => (
                <article key={idx} className="w-72 bg-white shadow-[0_3px_0_#c5c5c5] relative flex flex-col animate-pulse min-h-[269px]">
                  <div className="w-full h-48 bg-gray-300"></div>
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {!loading && !error && filteredArticles.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg font-medium text-gray-700">Coming Soon</p>
          </div>
        )}

        {/* Initial category content */}
        {!loading && !error && filteredArticles.length > 0 && (
          <CategorySection
            label={labelMap[initialCategory]}
            items={filteredArticles.filter(item => item.subcategory === initialCategory)}
            slugKey={initialCategory.replace(/_/g, '-')}
          />
        )}

        {/* Other categories */}
        {!loading && !error && filteredArticles.length > 0 &&
          Object.entries(
            filteredArticles.reduce((acc, item) => {
              if (item.subcategory !== initialCategory) (acc[item.subcategory] ||= []).push(item);
              return acc;
            }, {})
          ).map(([key, items]) => (
            <div key={key}>
              <h3 className="text-xl font-semibold mb-8 text-gray-900">{labelMap[key] || key}</h3>
              <CategorySection
                label={labelMap[key] || key}
                items={items}
                slugKey={key.replace(/_/g, '-')}
              />
            </div>
          ))
        }
      </div>
    </aside>
  );
}