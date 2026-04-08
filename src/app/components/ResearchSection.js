"use client"
import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import { useDataContext } from '@/app/context/DataContext';
import Link from 'next/link';

const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

// Format date as MM/DD/YY
function formatDate(date) {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  return `${mm}/${dd}/${yy}`;
}

// Grid-style CategorySection for Policy Toolkit layout
function CategorySection({ label, items, slugKey }) {
  const displayItems = items.slice(0, 4);
  
  return (
    <div className="mb-8 pb-4">
      {/* Horizontal grid with see all button */}
      <div className="flex items-start gap-4">
        <div className="flex flex-wrap gap-6 flex-1">
          {displayItems.map(item => (
            <Link 
              key={item.id} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex w-[calc(50%-12px)] sm:w-[220px] max-w-[220px] flex-col transform transition duration-200 ease-in-out hover:-translate-y-1"
            >
              {/* Image container with date badge */}
              <div className="relative w-full aspect-[220/163] bg-gray-200 mb-1">
                <img src={item.image_link} alt={item.title} className="w-full h-full object-cover" />
                {item.date && (
                  <span className="absolute top-2 right-0 bg-[#1B3F60] text-white text-xs font-medium px-2 py-1">
                    {formatDate(item.date)}
                  </span>
                )}
              </div>
              {/* Blue underline */}
              <div className="border-t-4 border-[#1B3F60] mb-2"></div>
              {/* Title with external link */}
              <div className="flex items-start gap-1">
                <p className="text-sm font-medium text-gray-900 line-clamp-3 flex-1">{item.title}</p>
                <img src={`${prefix}/images/external_link.svg`} alt="External link" className="w-4 h-4 flex-shrink-0 mt-0.5" />
              </div>
            </Link>
          ))}
        </div>
        
        {/* See all button on the right */}
        {items.length > 4 && (
          <div className="flex flex-col items-end justify-center self-center">
            <span className="text-sm text-gray-600 mb-2">see all</span>
            <Link 
              href={`/${slugKey}`} 
              aria-label={`View all ${label} items`} 
              className="w-10 h-10 bg-[#1B3F60] rounded-full flex items-center justify-center hover:bg-[#1B3F60]/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// List-style item for Research page layout
function ListItem({ item }) {
  return (
    <Link 
      href={item.link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex gap-4 md:gap-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
    >
      {/* Image thumbnail */}
      <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-24 bg-gray-200">
        <img src={item.image_link} alt={item.title} className="w-full h-full object-cover" />
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Title */}
        <h3 className="text-base md:text-lg font-bold text-[#1B3F60] mb-2">{item.title}</h3>
        
        {/* Spacer to push external link to bottom */}
        <div className="flex-1"></div>
        
        {/* External link in bottom right */}
        <div className="flex justify-end">
          <img src={`${prefix}/images/external_link.svg`} alt="External link" className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
}

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

// Parse tags from comma-separated string
function parseTags(raw) {
  if (!raw) return [];
  return String(raw).split(',').map(t => t.trim()).filter(Boolean);
}

export default function ResearchSection({ 
  csvUrl, 
  mainHeading = 'Research', 
  initialCategory = 'data_for_action', 
  showInitialHeading = true, 
  layout = 'grid' // 'grid' for Policy Toolkit style, 'list' for Research style
}) {
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
            date: item.date && String(item.date).trim() ? parseDateLocal(item.date) : null,
            subcategory: item.subcategory || item.Subcategory || '',
            link: item.link || item.Link || '#',
            readTime: item.readTime || item['Read time'] || item.ReadTime || '',
            outlet: item.outlet || item.Outlet || item['outlet'] || '',
            tags: parseTags(item.tags || item.Tags || '')
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

  // Real-time search filtering (only for list layout)
  useEffect(() => {
    if (layout !== 'list') {
      setFilteredArticles(articles);
      return;
    }
    const q = search.toLowerCase();
    let result = articles.filter(i => 
      i.title.toLowerCase().includes(q) || 
      (i.description && i.description.toLowerCase().includes(q)) ||
      (i.outlet && i.outlet.toLowerCase().includes(q)) ||
      (i.tags && i.tags.some(tag => tag.toLowerCase().includes(q)))
    );
    setFilteredArticles(result);
  }, [search, articles, layout]);

  // Filter items for the initial category
  const initialCategoryItems = filteredArticles.filter(item => item.subcategory === initialCategory);

  return (
    <aside className="pb-2 bg-white">
      <div className="container px-4 max-w-7xl">
        {/* Header row with title and search/sort for list layout */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#1B3F60]">{mainHeading}</h2>
            {layout === 'list' && showInitialHeading && (
              <h3 className="text-lg font-medium text-gray-700 mt-1">{labelMap[initialCategory]}</h3>
            )}
          </div>
          
          {/* Search and Sort controls for list layout */}
          {layout === 'list' && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {/* Search input */}
              <div className="flex items-center bg-white border border-[#1b3f60] rounded-full h-10 min-w-0 sm:min-w-[300px]">
                <input
                  type="text"
                  placeholder="Search for title, tag, or keyword"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 h-full pl-4 pr-2 text-sm text-[#1B3F60] placeholder-[#1B3F60]/60 bg-transparent rounded-l-full focus:outline-none"
                />
                <span className="flex items-center justify-center w-10 h-full bg-[#1B3F60] rounded-r-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </span>
              </div>
              
              {/* Sort dropdown */}
              <button
                onClick={() => setSortAsc(prev => !prev)}
                className="flex items-center bg-white text-[#1b3f60] rounded-full border border-[#1b3f60] h-10 min-w-[120px]"
              >
                <span className="flex-1 px-4 text-sm font-medium text-center">
                  {sortAsc ? 'Oldest' : 'Newest'}
                </span>
                <span className="flex items-center justify-center w-10 h-full bg-[#1b3f60] rounded-r-full">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="2" 
                    viewBox="0 0 24 24"
                    className={`transform ${sortAsc ? 'rotate-180' : ''}`}
                  >
                    <path d="M4 8h16M4 16h10" />
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Category heading for grid layout */}
        {layout === 'grid' && showInitialHeading && (
          <h3 className="text-xl font-semibold mb-6 text-gray-900">{labelMap[initialCategory]}</h3>
        )}

        {/* Loading state */}
        {loading && (
          <>
            {layout === 'list' ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="flex gap-4 py-4 animate-pulse">
                    <div className="w-32 h-24 bg-gray-200 flex-shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Mobile skeleton */}
                <div className="block md:hidden space-y-4">
                  {[...Array(3)].map((_, idx) => (
                    <div key={idx} className="flex gap-4 bg-white p-4 rounded-lg shadow-sm animate-pulse">
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-300 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop skeleton */}
                <div className="hidden md:flex gap-6">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="w-48 animate-pulse">
                      <div className="w-full h-32 bg-gray-200 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* No results state */}
        {!loading && !error && filteredArticles.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg font-medium text-gray-700">No Search Results Found</p>
          </div>
        )}

        {/* Content based on layout */}
        {!loading && !error && filteredArticles.length > 0 && (
          <>
            {layout === 'list' ? (
              /* List layout for Research page */
              <div className="divide-y divide-gray-200">
                {initialCategoryItems.map(item => (
                  <ListItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              /* Grid layout for Policy Toolkit */
              <>
                {/* Initial category */}
                <CategorySection
                  label={labelMap[initialCategory]}
                  items={initialCategoryItems}
                  slugKey={initialCategory.replace(/_/g, '-')}
                />

                {/* Other categories */}
                {Object.entries(
                  filteredArticles.reduce((acc, item) => {
                    if (item.subcategory !== initialCategory) (acc[item.subcategory] ||= []).push(item);
                    return acc;
                  }, {})
                ).map(([key, items]) => (
                  <div key={key}>
                    <h3 className="text-xl font-semibold mb-6 text-gray-900">{labelMap[key] || key}</h3>
                    <CategorySection
                      label={labelMap[key] || key}
                      items={items}
                      slugKey={key.replace(/_/g, '-')}
                    />
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </aside>
  );
}