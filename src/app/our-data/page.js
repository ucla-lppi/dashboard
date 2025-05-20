"use client";
import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import { useDataContext } from '@/app/context/DataContext';
const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

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
        <h2 className="text-3xl font-bold text-primary mb-6">Our Data</h2>
        <hr className="border-gray-200 mb-4" />
        <p className="mb-6 text-base text-[#005587]">
          This section and our Frequently Asked Questions answer many common questions about the methods and indicators used to develop the Latino Climate and Health Dashboard. Please refer to the technical report for more information on our methods and data sources.
        </p>
        {/* filters row */}
        <div className="grid grid-cols-2 gap-1 mb-4">
          {/* Filter cell */}
          <div className="flex justify-start relative" ref={catFilterRef}>
            <button
              onClick={() => setShowCatFilters(!showCatFilters)}
              className="flex items-center bg-white text-[#005587] rounded-full border border-primary w-full max-w-[12rem]"
            >
              <span className="flex-1 px-4 py-2 text-base font-normal text-center">Topical Areas</span>
              <span className="flex items-center justify-center w-10 h-10 bg-[#005587] rounded-r-full">
                <img
                  src={`${prefix}/images/descending.svg`}
                  alt="Toggle"
                  className={`w-4 h-4 transform ${showCatFilters ? 'rotate-180' : ''}`}
                />
              </span>
            </button>
            {showCatFilters && (
              <div className="absolute left-0 mt-2 bg-white border rounded-lg shadow-lg p-4 max-h-48 overflow-y-auto z-50 w-[12rem]">
                {allCats.map(cat => (
                  <label key={cat} className="inline-flex items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedCats.includes(cat)}
                      onChange={() => toggleCat(cat)}
                      className="form-checkbox text-primary"
                    />
                    <span className="ml-2 text-[#005587]">{cat}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
          {/* Search cell */}
          <div className="flex justify-start">
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
         </div>
         {/* condition buttons */}
         <div className="flex space-x-4 mb-6">
            <button onClick={()=>toggleCond('heat')} className={`flex items-center px-4 py-2 rounded border ${filters.heat? 'bg-primary text-white':'bg-white text-[#005587]'}`}>
             <img src={`${prefix}/images/extremeheaticon-${filters.heat ? 'white' : 'primary'}.svg`} alt="Extreme Heat" className="w-5 h-5 mr-2"/>Extreme Heat
            </button>
            <button onClick={()=>toggleCond('pollution')} className={`flex items-center px-4 py-2 rounded border ${filters.pollution? 'bg-primary text-white':'bg-white text-[#005587]'}`}>
             <img src={`${prefix}/images/airpollutionicon-${filters.pollution ? 'white' : 'primary'}.svg`} alt="Air Pollution" className="w-5 h-5 mr-2"/>Air Pollution
            </button>
          </div>
        {/* cards */}
        {loading ? <p>Loading...</p> : (
          <div className="space-y-6">
            {filtered.map(item=>(
              <article key={item.id} className="border rounded p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-center mb-4">
                  <span className="mr-2">{item.indicator.replace(/🔥|💨/g,'').trim()}</span>
                  {item.indicator.includes('🔥') && <img src={`${prefix}/images/extremeheaticon-primary.svg`} alt="Heat" className="w-5 h-5 mr-1" />}
                  {item.indicator.includes('💨') && <img src={`${prefix}/images/airpollutionicon-primary.svg`} alt="Pollution" className="w-5 h-5" />}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.cats.map(c=> <span key={c} className="bg-gray-200 px-2 py-1 rounded text-sm">{c}</span>)}
                </div>
                <p className="mb-2"><strong>Description:</strong> {item.desc}</p>
                <p><strong>Source:</strong> {item.source}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
