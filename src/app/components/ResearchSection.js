"use client"
import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import { useDataContext } from '@/app/context/DataContext';
import Link from 'next/link';

const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

export default function ResearchSection({ csvUrl, mainHeading = 'Research', initialCategory = 'data_for_action', showInitialHeading = true }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
            date: item.date ? new Date(item.date) : new Date(),
            subcategory: item.subcategory || item.Subcategory || '',
            link: item.link || item.Link || '#',
            readTime: item.readTime || item['Read time'] || item.ReadTime || ''
          }))
          .filter(item => item.title && item.image_link)
          .sort((a, b) => b.date - a.date);
        setArticles(mapped);
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
  }, [csvUrl]);

  // Subcomponent to render each subcategory with its header, toggle, and layout
  function CategorySection({ label, items, slugKey }) {
    // Display only first 4 items, navigation instead of toggle
    const displayItems = items.slice(0, 4);
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
        {/* Mobile carousel */}
        <div className="block md:hidden relative group">
          <div ref={carouselRef} className="flex space-x-6 overflow-x-auto pb-4">
            {displayItems.map(item => (
              <Link key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="inline-block w-72 bg-white shadow-[0_3px_0_#c5c5c5] relative flex flex-col min-h-[269px] transform transition duration-200 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_5px_0_#c5c5c5]">
                <img src={item.image_link} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="relative mb-2">
                    <h4 className="text-lg text-gray-900 break-words pr-6">{item.title}</h4>
                    <img src={`${prefix}/images/external_link.svg`} alt="External link" className="w-4 h-4 absolute top-0 right-0" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {overflow && (
            <>
              <button onClick={() => carouselRef.current.scrollBy({ left: -carouselRef.current.clientWidth, behavior: 'smooth' })}
                className="hidden group-hover:flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full shadow focus:outline-none focus:ring"
              >‹</button>
              <button onClick={() => carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth, behavior: 'smooth' })}
                className="hidden group-hover:flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full shadow focus:outline-none focus:ring"
              >›</button>
            </>
          )}
        </div>
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
          {displayItems.map(item => (
            <Link key={item.id} href={item.link} target="_blank" rel="noopener noreferrer" className="w-72 bg-white shadow-[0_3px_0_#c5c5c5] relative flex flex-col min-h-[269px] transform transition duration-200 ease-in-out hover:-translate-y-[5px] hover:shadow-[0_5px_0_#c5c5c5]">
              <img src={item.image_link} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-4 flex-1 flex flex-col">
                <div className="relative mb-2">
                  <h4 className="text-lg font-bold text-gray-900 break-words pr-6">{item.title}</h4>
                  <img src={`${prefix}/images/external_link.svg`} alt="External link" className="w-4 h-4 absolute top-0 right-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {items.length > 4 && (
          <div className="mt-4 flex justify-end items-center space-x-2">
            <span href={`/${slugKey}`} aria-label={`View all ${label} items`} className="text-black font-medium">
              see all
            </span>
            <Link href={`/${slugKey}`} aria-label={`View all ${label} items`} className="inline-flex items-center justify-center w-10 h-10 bg-primary text-white rounded-full hover:bg-primary/90 focus:outline-none focus:ring">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 25 24" aria-hidden="true">
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

        {/* Initial category section */}
        {showInitialHeading && (
          <h3 className="text-xl font-semibold mb-8 text-gray-900">{labelMap[initialCategory]}</h3>
        )}
        {loading && (
          <>
            {/* Mobile skeleton carousel */}
            <div className="block md:hidden flex space-x-6 overflow-x-auto pb-4">
              {[...Array(4)].map((_, idx) => (
                <article key={idx} className="inline-block w-72 bg-white shadow-[0_3px_0_#c5c5c5] relative flex flex-col animate-pulse min-h-[269px]">
                  <div className="w-full h-48 bg-gray-300"></div>
                  {/* title/text placeholders */}
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  </div>
                </article>
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

        {!loading && !error && articles.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg font-medium text-gray-700">Coming Soon</p>
          </div>
        )}

        {/* Initial category content */}
        {!loading && !error && articles.length > 0 && (
          <CategorySection
            label={labelMap[initialCategory]}
            items={articles.filter(item => item.subcategory === initialCategory)}
            slugKey={initialCategory.replace(/_/g, '-')}
          />
        )}

        {/* Other categories */}
        {!loading && !error && articles.length > 0 &&
          Object.entries(
            articles.reduce((acc, item) => {
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