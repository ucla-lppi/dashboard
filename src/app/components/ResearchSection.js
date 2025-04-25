"use client"
import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';

export default function ResearchSection({ csvUrl, mainHeading = 'Research', initialCategory = 'data_for_action', showInitialHeading = true }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category labels
  const labelMap = {
    data_for_action: 'Data for Action',
    press_coverage: 'Press Coverage',
    partners: 'Partners',
  };

  useEffect(() => {
    setLoading(true);
    fetch(csvUrl)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load CSV (${res.status})`);
        return res.text();
      })
      .then(text => {
        Papa.parse(text, {
          header: true,
          complete: ({ data, errors }) => {
            if (errors.length) {
              setError('Error parsing data');
              setLoading(false);
              return;
            }
            // Map rows to expected fields (include File and Title columns)
            const mapped = data
              .map((item, idx) => ({
                id: item.id || item.ID || idx,
                title: item.Title || item.title || '',
                description: item.Description || item.description || '',
                imageUrl: item.File || item.file || item.imageUrl || item.Image || '',
                date: item.date ? new Date(item.date) : new Date(),
                subcategory: item.subcategory || item.Subcategory || '',
                link: item.link || item.Link || '#',
                readTime: item.readTime || item['Read time'] || item.ReadTime || ''
              }))
              // Filter out rows missing a title or image
              .filter(item => item.title && item.imageUrl);
            // Sort by date descending
            const sorted = mapped.sort((a, b) => b.date - a.date);
            setArticles(sorted);
            setLoading(false);
          }
        });
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [csvUrl]);

  // Subcomponent to render each subcategory with its header, toggle, and layout
  function CategorySection({ label, items }) {
    const [showAll, setShowAll] = useState(false);
    const carouselRef = useRef(null);
    // Check overflow to show nav arrows
    const [overflow, setOverflow] = useState(false);
    useEffect(() => {
      const el = carouselRef.current;
      if (el) setOverflow(el.scrollWidth > el.clientWidth);
      const handle = () => el && setOverflow(el.scrollWidth > el.clientWidth);
      window.addEventListener('resize', handle);
      return () => window.removeEventListener('resize', handle);
    }, [items]);
    const displayItems = showAll ? items : items.slice(0, 4);
    return (
      <div className="mb-12 relative pb-16">
        {/* Section content (heading rendered externally) */}
        {/* Mobile carousel */}
        <div className="block md:hidden relative group">
          <div ref={carouselRef} className="flex space-x-6 overflow-x-auto pb-4">
            {displayItems.map(item => (
              <article key={item.id} className="inline-block w-64 p-1 pb-10 bg-white rounded-lg overflow-hidden relative flex flex-col min-h-[28rem]">
                <a href={item.link} className="block hover:shadow-lg transition-shadow">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover mb-4" />
                  <h4 className="text-lg text-gray-900 mb-2 break-words">{item.title}</h4>
                </a>
                {/* 3px gray underline */}
                <div className="absolute left-0 bottom-0 w-full h-[3px] bg-gray-200"></div>
              </article>
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
            <article key={item.id} className="p-1 pb-10 bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow relative flex flex-col h-full min-h-[28rem]">
              <a href={item.link}>
                <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover mb-4" />
                <h4 className="text-lg font-bold text-gray-900 mb-2 break-words">{item.title}</h4>
              </a>
              {/* 3px gray underline */}
              <div className="absolute left-0 bottom-0 w-full h-[3px] bg-gray-200"></div>
            </article>
          ))}
        </div>
        {/* absolute bottom-right toggle */}
        {items.length > 4 && (
          <div className="absolute bottom-10 right-0 flex flex-col items-end space-y-1">
            <span className="text-primary font-medium">{showAll ? 'See less' : 'See all'}</span>
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-label={showAll ? 'See less items' : 'See all items'}
            >
              <span className="text-lg">{showAll ? '←' : '→'}</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <aside className="py-8 bg-white">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{mainHeading}</h2>
        </div>

        {/* Initial category section */}
        {showInitialHeading && (
          <h3 className="text-xl font-semibold mb-6 text-gray-900">{labelMap[initialCategory]}</h3>
        )}
        {loading && (
          <>
            {/* Mobile skeleton carousel */}
            <div className="block md:hidden flex space-x-6 overflow-x-auto pb-4">
              {[...Array(4)].map((_, idx) => (
                <article key={idx} className="inline-block w-64 p-1 pb-10 bg-white rounded-lg overflow-hidden relative animate-pulse min-h-[28rem]">
                  {/* image placeholder */}
                  <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
                  {/* title/text placeholders */}
                  <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  {/* 3px gray underline */}
                  <div className="absolute left-0 bottom-0 w-full h-[3px] bg-gray-200"></div>
                </article>
              ))}
            </div>
            {/* Desktop skeleton grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 items-stretch">
              {[...Array(4)].map((_, idx) => (
                <article key={idx} className="p-1 pb-10 bg-white overflow-hidden relative flex flex-col h-full animate-pulse min-h-[28rem]">
                  <div className="flex-1">
                    <div className="w-full h-48 bg-gray-300 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                  {/* 3px gray underline */}
                  <div className="absolute left-0 bottom-0 w-full h-[3px] bg-gray-200"></div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Initial category content */}
        {!loading && !error && (
          <CategorySection
            label={labelMap[initialCategory]}
            items={articles.filter(item => item.subcategory === initialCategory)}
          />
        )}

        {/* Other categories */}
        {!loading && !error &&
          Object.entries(
            articles.reduce((acc, item) => {
              if (item.subcategory !== initialCategory) (acc[item.subcategory] ||= []).push(item);
              return acc;
            }, {})
          ).map(([key, items]) => (
            <div key={key}>
              <h3 className="text-xl font-semibold mb-6 text-gray-900">{labelMap[key] || key}</h3>
              <CategorySection label={labelMap[key] || key} items={items} />
            </div>
          ))
        }
      </div>
    </aside>
  );
}