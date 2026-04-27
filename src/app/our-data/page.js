"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import indicatorsData from '@/generated/indicators.json';
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

// Helper to convert markdown links in CSV fields to HTML anchors
function parseCsvLinks(text) {
  if (!text) return '';
  const escaped = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return escaped.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary underline">$1</a>');
}

export default function OurDataPage() {
  const [isMobile, setIsMobile] = useState(false);
  const items = indicatorsData.map((row, idx) => ({
    id: row.id ?? idx,
    indicator: row.indicator || '',
    cats: Array.isArray(row.cats) ? row.cats : (row.cats || '').split(',').map(c => c.trim()).filter(Boolean),
    desc: row.desc || row.description || '',
    geography: row.geography || '',
    sampleInterpretation: row.sampleInterpretation || row.sample_interpretation || '',
    source: row.source || '',
  }));
  const [filtered, setFiltered] = useState([]);
  const loading = false;
  const [search, setSearch] = useState('');
  const [selectedCats, setSelectedCats] = useState([]);
  const [filters, setFilters] = useState({ heat: false, pollution: false });
  const [showCatFilters, setShowCatFilters] = useState(false);
  const catFilterRef = useRef(null);

  // detect mobile devices
  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
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
    <section className="py-8 bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)]">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="pl-4 text-3xl font-bold text-primary mb-6">Our Data</h2>
        <hr className="pl-4 border-gray-200 mb-4" />
        <div className="pl-4 mb-6 space-y-3 text-base text-black">
          <p>
            This section, along with our {" "}
            <a
              href="https://latinoclimatehealth.org/faqs/"
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Frequently Asked Questions
            </a>
            , addresses many common questions about the methods and indicators used to develop the Latino Climate and Health Dashboard. This section also provides examples of how to interpret indicators using data from the California factsheets.
          </p>
          <p>In our factsheets, we present data at both the population level and the neighborhood level.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              In our county-level and state-level indicators, we report statistics comparing outcomes for Latino and non-Latino white populations. These comparisons focus on population-level characteristics disaggregated by race and ethnicity.
            </li>
            <li>
              At the neighborhood level, we report statistics representing residents, households, and workers within neighborhoods, and report data by neighborhood types (e.g., Latino neighborhoods). For example, although a neighborhood may be made up of mostly Latino residents, it also includes individuals from other racial and ethnic backgrounds.
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  For more information on how we define neighborhoods, please visit our {" "}
                  <a
                    href="https://latinoclimatehealth.org/faqs/#neighborhoods"
                    className="text-primary underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FAQ
                  </a>
                  .
                </li>
              </ul>
            </li>
          </ul>
          <p>
            Please refer to the {" "}
            <Link
              href="https://latino.ucla.edu/research/climate-health-dashboard-technical-doc/"
              className="text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              technical report
              <img
                src={`${prefix}/images/external_link_blue.svg`}
                alt="(external link)"
                className="inline ml-1 w-4 h-4 align-text-bottom"
              />
            </Link>{" "}
            for more information.
          </p>
        </div>
        {/* Line divider */}
        <hr className="border-[#AEC8C3] mb-4 ml-4" />
        {/* filters row - stack on mobile, horizontal on desktop */}
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-2 mb-4 pl-4">
          {/* Topical Area */}
          <div className="relative w-full md:w-auto" ref={catFilterRef}>
            <button
              onClick={() => setShowCatFilters(!showCatFilters)}
              className="
                flex items-center justify-between
                w-full md:w-[250px] h-[30px]
                bg-white text-[#1B3F60]
                rounded-full border border-[#1b3f60]
                pl-6 pr-0
              "
            >
              <span className="text-base font-lexend-lite text-[#1B3F60]/80">
                Category
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
              <div className="absolute left-0 mt-2 w-full md:w-[300px] bg-white border rounded-lg shadow-lg p-4 max-h-48 overflow-y-auto z-50">
                <div className="flex flex-wrap gap-2">
                  {allCats.map(cat => {
                    const bg = categoryColorDict[cat] || '#ccc'
                    const isActive = selectedCats.includes(cat)
                    return (
                      <label
                        key={cat}
                        className="inline-flex items-center mb-2 space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggleCat(cat)}
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
          <div className="flex items-center bg-white border border-[#1b3f60] rounded-full w-full md:w-[450px] h-[30px]">
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
          <div className="flex flex-wrap gap-x-2 gap-y-2 mb-4 pl-4">
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
         <div className="flex flex-wrap gap-2 mb-6 pl-4">
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
          inline-flex items-center justify-center
          px-4 py-[5px]
          rounded-full
          border border-[#1b3f60]
          shrink-0
          ${active
            ? 'bg-primary text-white shadow-none'
            : 'bg-[#fcfcfc] text-[#1b3f60] shadow-[0_2px_0_#1b3f60]'
          }
        `}
      >
        <img src={`${prefix}${icon}`} alt={label} className="w-5 h-5 mr-2 shrink-0" />
        <span className="whitespace-nowrap">{label}</span>
      </button>
    )
  })}
</div>
        {/* cards */}
        {loading ? <p>Loading...</p> : (
          <div className="space-y-6">
            {filtered.length === 0 && (
              <p className="text-lg font-medium text-gray-700 py-8 text-center">No Search Results Found</p>
            )}
            {filtered.map(item=>(
               <article key={item.id} className="border rounded p-6 shadow-sm">
                <h3 className="text-xl font-bold flex items-start mb-4">
                  <span className="mr-2 leading-snug">
                    {item.indicator.replace(/🔥|💨/g,'').trim()}
                  </span>

                  {item.indicator.includes('🔥') && (
                    <button
                      type="button"
                      onClick={() => toggleCond('heat')}
                      className={`
                        inline-flex items-center justify-center
                        w-[36px] h-[36px]
                        border border-[#1B3F60]
                        rounded-full
                        mr-1 shrink-0 cursor-pointer
                        ${filters.heat 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-[#1B3F60]'}
                      `}
                      title="Toggle Extreme Heat"
                    >
                      <img
                        src={`${prefix}/images/extremeheaticon-${filters.heat ? 'white' : 'primary'}.svg`}
                        alt="Heat"
                        className="w-5 h-5 shrink-0"
                      />
                    </button>
                  )}

                  {item.indicator.includes('💨') && (
                    <button
                      type="button"
                      onClick={() => toggleCond('pollution')}
                      className={`
                        inline-flex items-center justify-center
                        w-[36px] h-[36px]
                        border border-[#1B3F60]
                        rounded-full
                        shrink-0 cursor-pointer
                        ${filters.pollution 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-[#1B3F60]'}
                      `}
                      title="Toggle Air Pollution"
                    >
                      <img
                        src={`${prefix}/images/airpollutionicon-${filters.pollution ? 'white' : 'primary'}.svg`}
                        alt="Pollution"
                        className="w-5 h-5 shrink-0"
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
                <div className="mb-2" dangerouslySetInnerHTML={{__html: `<strong class="underline">Description:</strong> ${parseCsvLinks(item.desc)}`}} />
                {item.geography && (
                  <div className="mb-2" dangerouslySetInnerHTML={{__html: `<strong class="underline">Geography:</strong> ${parseCsvLinks(item.geography)}`}} />
                )}
                {item.sampleInterpretation && (
                  <div className="mb-2" dangerouslySetInnerHTML={{__html: `<strong class="underline">Sample Interpretation:</strong> ${parseCsvLinks(item.sampleInterpretation)}`}} />
                )}
                {item.source && (
                  <div dangerouslySetInnerHTML={{__html: `<strong class="underline">Source:</strong> ${parseCsvLinks(item.source)}`}} />
                )}
               </article>
             ))}
          </div>
        )}
      </div>
    </section>
  );
}
