"use client";
import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { useDataContext } from '@/app/context/DataContext';
import Link from 'next/link';  // ← add this at the top
const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

const categoryColorDict = {
  'Air Pollutants': '#2C483E',
  'Demographic Indicators': '#3c87c3',
  'Heat Exposure': '#338F87',
  'Social Determinants of Health': '#005587',
  'Vulnerable Populations': '#226961',
  'Health Outcomes & Conditions': '#005587',
  'Environmental Hazards': '#11423c',
};

export default function OurDataPage() {
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=1408499517&single=true&output=csv';
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [filters, setFilters] = useState({ heat: false, pollution: false });
  const [showCatFilters, setShowCatFilters] = useState(false);
  const catFilterRef = useRef(null);
  const { getDataForUrl, setDataForUrl } = useDataContext();

  useEffect(() => {
    setLoading(true);
    const cached = getDataForUrl(csvUrl);
    const process = data => {
      const mapped = data.map((row, idx) => {
        const indicator = row.Indicator || '';
        const cats = (row.Category || '').split(',').map(c=>c.trim()).filter(Boolean);
        return {
          id: idx,
          indicator,
          cats,
          desc: row.Description || '',
          source: row.Source || ''
        };
      });
      setItems(mapped);
      setLoading(false);
    };
    if (cached) {
      process(cached);
    } else {
      fetch(csvUrl)
        .then(res => res.text())
        .then(txt => {
          Papa.parse(txt, { header: true, complete: ({ data }) => {
            setDataForUrl(csvUrl, data);
            process(data);
          }});
        });
    }
  }, []);

  // compute categories list
  const allCats = Array.from(new Set(items.flatMap(i=>i.cats))).sort();

  useEffect(() => {
    let res = items;
    // text search
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(i => i.indicator.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));
    }
    // category filter
    if (selectedCats.length) {
      res = res.filter(i => i.cats.some(c=> selectedCats.includes(c)));
    }
    // condition filters
    const { heat, pollution } = filters;
    if (heat || pollution) {
      res = res.filter(i => (heat && i.indicator.includes('🔥')) || (pollution && i.indicator.includes('💨')));
    }
    setFiltered(res);
  }, [items, search, selectedCats, filters]);

  const toggleCat = cat => {
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c=>c!==cat) : [...prev, cat]);
  };
  const toggleCond = type => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  // Close topical areas dropdown on outside click
  useEffect(() => {
    if (!showCatFilters) return;
    function handleClick(e) {
      if (catFilterRef.current && !catFilterRef.current.contains(e.target)) {
        setShowCatFilters(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showCatFilters]);

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="pl-4 text-3xl font-bold text-primary mb-6">Our Data</h2>
        <hr className="pl-4 border-gray-200 mb-4" />
        <p className="pl-4 mb-6 text-base text-black">
          This section and our{" "}
          <Link href="/faqs" className="text-primary underline">
            Frequently Asked Questions
          </Link>{" "}
          answer many common questions about the methods and indicators used to develop the Latino Climate and Health Dashboard. Please refer to the technical report for more information on our methods and data sources.
        </p>
        {/* Line divider */}
        <hr className="border-[#AEC8C3] mb-4 ml-4" />
        {/* filters row */}
        <div className="flex items-center space-x-2 mb-4 pl-4">
          {/* Topical Area */}
          <div className="relative" ref={catFilterRef}>
            <button
              onClick={() => setShowCatFilters(!showCatFilters)}
              className="
                flex items-center justify-between
                w-[250px] h-[30px]
                bg-white text-[#1B3F60]
                rounded-full border border-[#1b3f60]
                pl-6 pr-0
              "
            >
              <span className="text-base font-lexend-lite text-[#1B3F60]/80">
                Topical Area
              </span>
              <span className="flex items-center justify-center w-[30px] h-full bg-[#1B3F60] rounded-r-full">
                <img
                  src={`${prefix}/images/descending.svg`}
                  alt="Toggle"
                  className={`w-4 h-4 transform ${showCatFilters ? 'rotate-180' : ''}`}
                />
              </span>
            </button>
            {showCatFilters && (
              <div className="absolute left-0 mt-2 w-[300px] bg-white border rounded-lg shadow-lg p-4 max-h-48 overflow-y-auto z-50">
                <div className="flex flex-wrap gap-2">
                  {allCats.map(cat => {
                    const bg = categoryColorDict[cat] || '#ccc'
                    const isActive = selectedCats.includes(cat)
                    return (
                      <label
                        key={cat}
                        className="inline-flex items-center mb-2 space-x-2 cursor-pointer"
                        onClick={() => toggleCat(cat)}
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          readOnly
                          className="h-4 w-4 text-white border-white"
                        />
                        <span
                          className="inline-flex items-center h-[26px] px-3 rounded-full text-xs text-white"
                          style={{ backgroundColor: bg }}
                        >
                          {cat}
                        </span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="flex items-center w-[450px] h-[30px] bg-white border border-[#1b3f60] rounded-full">
            <input
              type="text"
              placeholder="Search for title, tag, or keyword"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="
                flex-1 h-full
                pl-6 pr-2
                text-base font-lexend-lite text-[#1B3F60]
                placeholder-[#1B3F60]/80
                bg-transparent rounded-l-full focus:outline-none
              "
            />
            <span className="flex items-center justify-center w-10 h-full bg-[#1B3F60] rounded-r-full">
              <img src={`${prefix}/images/search_icon.svg`} alt="Search" className="w-4 h-4" />
            </span>
          </div>
        </div>  {/* end filters row */}
        {/* selected category pills */}
        {selectedCats.length > 0 && (
          <div className="flex flex-wrap space-x-2 mb-4 pl-4">
            {selectedCats.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCat(cat)}
                className="flex items-center h-[26px] px-3 rounded-full text-xs text-white"
                style={{ backgroundColor: categoryColorDict[cat] || '#ccc' }}
              >
                <span className="mr-1">&times;</span>
                {cat}
              </button>
            ))}
          </div>
        )}
         {/* condition buttons */}
         <div className="flex space-x-4 mb-6 pl-4">
  {/** base pill style **/}
  {['heat', 'pollution'].map((type, i) => {
    const isHeat = type === 'heat';
    const active = filters[type];
    const icon = isHeat
      ? `/images/extremeheaticon-${active ? 'white' : 'primary'}.svg`
      : `/images/airpollutionicon-${active ? 'white' : 'primary'}.svg`;
    const label = isHeat ? 'Extreme Heat' : 'Air Pollution';

    return (
      <button
        key={type}
        onClick={() => toggleCond(type)}
        className={`
          flex items-center justify-center
          w-[192px] h-[29px]
          rounded-full
          border border-[#1b3f60]
          ${active
            ? 'bg-primary text-white shadow-none'
            : 'bg-[#fcfcfc] text-[#1b3f60] shadow-[0_2px_0_#1b3f60]'
          }
        `}
      >
        <img src={`${prefix}${icon}`} alt={label} className="w-5 h-5 mr-2" />
        {label}
      </button>
    )
  })}
</div>
        {/* cards */}
        {loading ? <p>Loading...</p> : (
          <div className="space-y-6">
            {filtered.map(item=>(
               <article key={item.id} className="border rounded p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center mb-4">
                  <span className="mr-2">
                    {item.indicator.replace(/🔥|💨/g,'').trim()}
                  </span>

                  {item.indicator.includes('🔥') && (
                    <button
                      type="button"
                      onClick={() => toggleCond('heat')}
                      className={`
                        inline-flex items-center justify-center
                        w-[47px] h-[25px]
                        border border-[#1B3F60]
                        rounded-full
                        mr-1 cursor-pointer
                        ${filters.heat 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-[#1B3F60]'}
                      `}
                      title="Toggle Extreme Heat"
                    >
                      <img
                        src={`${prefix}/images/extremeheaticon-${filters.heat ? 'white' : 'primary'}.svg`}
                        alt="Heat"
                        className="w-5 h-5"
                      />
                    </button>
                  )}

                  {item.indicator.includes('💨') && (
                    <button
                      type="button"
                      onClick={() => toggleCond('pollution')}
                      className={`
                        inline-flex items-center justify-center
                        w-[47px] h-[25px]
                        border border-[#1B3F60]
                        rounded-full
                        cursor-pointer
                        ${filters.pollution 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-[#1B3F60]'}
                      `}
                      title="Toggle Air Pollution"
                    >
                      <img
                        src={`${prefix}/images/airpollutionicon-${filters.pollution ? 'white' : 'primary'}.svg`}
                        alt="Pollution"
                        className="w-5 h-5"
                      />
                    </button>
                  )}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.cats.map(cat => {
                    const bg = categoryColorDict[cat] || '#ccc';
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCat(cat)}
                        style={{ backgroundColor: bg }}
                        className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm text-white cursor-pointer"
                      >
                        {cat}
                      </button>
                    )
                  })}
                </div>
                <p className="mb-2"><strong>Description:</strong> {item.desc}</p>
                {item.source && (
                  <p><strong>Source:</strong> {item.source}</p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
