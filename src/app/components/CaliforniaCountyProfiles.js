"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import Divider from './Divider';
const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
// List of all counties
const allCounties = [
  "Alameda",
  "Contra Costa",
  "Fresno",
  "Imperial",
  "Kern",
  "Kings",
  "Los Angeles",
  "Madera",
  "Merced",
  "Monterey",
  "Orange",
  "Riverside",
  "Sacramento",
  "San Bernardino",
  "San Diego",
  "San Joaquin",
  "San Mateo",
  "Santa Barbara",
  "Santa Clara",
  "Santa Cruz",
  "Stanislaus",
  "Tulare",
  "Ventura"
];
// helper to build fact-sheet filenames
const slugCounty = name => name.replace(/\s+/g, '_');
// compute the length of the longest county name
const maxCountyLength = Math.max(...allCounties.map(c => c.length));

export default function CaliforniaCountyProfiles() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  const filtered = useMemo(() =>
    allCounties.filter(c => c.toLowerCase().includes(search.toLowerCase())), [search]
  );

  useEffect(() => {
    // Mobile device check via user agent or window width
    const checkMobile = () => {
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 540);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="bg-tertiary p-6 rounded">
      <div id="county-profiles" className={`flex ${isMobile ? 'flex-col' : 'gap-6'}`}>
        {/* Left Column (35% on desktop, full width on mobile) */}
        <div className={isMobile ? 'w-full mb-6' : 'w-[35%]'}>
          <p className="text-base text-gray-900 mb-4">
            The Latino Climate and Health Dashboard equips advocates and decision-makers with strategic data on climate and health risks in Latino neighborhoods to support healthier, more resilient communities in California.
            <br/><br/>
            {/* Currently, fact sheets are available for 23 California counties. */}
          </p>
		  <Divider />
			<div className="flex flex-col gap-4 mb-4 p-4">

			  <button
          onClick={() => router.push('/faqs')}
          className="bg-white font-bold text-primary px-4 py-2 rounded-[15px] shadow-[2px_2px_0px_#00000040]"
        >
          FAQ
        </button>
			</div>
        </div>
        {/* Divider - hidden on mobile */}
        {!isMobile && <div className="w-px bg-[#333333] self-stretch"></div>}
        {/* Right Column (75% on desktop, full width on mobile) */}
        <div className={isMobile ? 'w-full' : 'w-[75%]'}>
          <h2 className="text-xl font-bold text-[28px] text-gray-900 mb-4">List of California Factsheets</h2>
          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-full border border-primary w-full max-w-md mb-4">
            <input
              type="text"
              placeholder="Search for a location"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 font-lexendExtraLight font-extralight placeholder-gray-500 focus:outline-none rounded-l-full"
            />
            <span className="flex items-center justify-center w-10 h-10 bg-primary rounded-r-full">
              <img src={`${prefix}/images/search_icon.svg`} alt="Search" className="w-4 h-4" />
            </span>
          </div>

          {/* Counties List */}
          <SimpleBar autoHide={false} forceVisible="y" className="rounded w-full max-h-[275px] county-scrollbar overflow-x-hidden" scrollableNodeProps={{ className: 'px-4' }} style={{ maxHeight: 275 }}>
            <Divider />
            {/* California State Fact Sheets (always shown at top) */}
            <React.Fragment key="California State">
              <div className="flex justify-center items-center px-4 py-2">
                <div className="flex justify-between items-center w-full gap-6">
                  <span className={`text-gray-900 pl-1 font-bold whitespace-nowrap ${isMobile ? 'text-sm' : ''}`} style={{ minWidth: `${maxCountyLength}ch` }}>California</span>
                  {!isMobile && (
                    <div className="flex gap-2">
                      <a
                        href={`${prefix}/factsheets/extremeheat/California_state_extremeheat_2025.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative ${isMobile ? 'h-8 px-4' : 'h-6 px-3'}`}
                      >
                        <div className="absolute inset-0 bg-[#fcfcfc] rounded-[15px] shadow-[2px_2px_0px_#338F87]"></div>
                        <div className="relative flex items-center justify-center h-full gap-1">
                          <img src={`${prefix}/images/extremeheaticon-primary.svg`} alt="Extreme Heat" className="w-4 h-4" />
                          <span className={`text-primary ${isMobile ? 'text-[10px]' : 'text-sm'} font-normal`}>Extreme Heat</span>
                          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary ml-1" />
                        </div>
                      </a>
                      <a
                        href={`${prefix}/factsheets/extremeheat/California_state_extremeheat_2025.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`relative ${isMobile ? 'h-8 px-4' : 'h-6 px-3'}`}
                      >
                        <div className="absolute inset-0 bg-[#fcfcfc] rounded-[15px] shadow-[2px_2px_0px_#338F87]"></div>
                        <div className="relative flex items-center justify-center h-full gap-1">
                          <img src={`${prefix}/images/airpollutionicon-primary.svg`} alt="Air Pollution" className="w-4 h-4" />
                          <span className={`text-primary ${isMobile ? 'text-[10px]' : 'text-sm'} font-normal`}>Air Pollution</span>
                          <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary ml-1" />
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
              {isMobile && (
                <div className="flex gap-2 justify-center items-center mb-2">
                  <a
                    href={`${prefix}/factsheets/extremeheat/California_state_extremeheat_2025.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-8 px-4"
                  >
                    <div className="absolute inset-0 bg-[#fcfcfc] rounded-[15px] shadow-[2px_2px_0px_#338F87]"></div>
                    <div className="relative flex items-center justify-center h-full gap-1">
                      <img src={`${prefix}/images/extremeheaticon-primary.svg`} alt="Extreme Heat" className="w-4 h-4" />
                      <span className="text-primary text-[10px] font-normal">Extreme Heat</span>
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary ml-1" />
                    </div>
                  </a>
                  <a
                    href={`${prefix}/factsheets/airpollution/California_state_airpollution_2025.pdf`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative h-8 px-4"
                  >
                    <div className="absolute inset-0 bg-[#fcfcfc] rounded-[15px] shadow-[2px_2px_0px_#338F87]"></div>
                    <div className="relative flex items-center justify-center h-full gap-1">
                      <img src={`${prefix}/images/airpollutionicon-primary.svg`} alt="Air Pollution" className="w-4 h-4" />
                      <span className="text-primary text-[10px] font-normal">Air Pollution</span>
                      <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary ml-1" />
                    </div>
                  </a>
                </div>
              )}
              <Divider />
            </React.Fragment>
             {filtered.map((county, idx) => (
               <React.Fragment key={county}>
                <div className="flex justify-center items-center px-4 py-2">
                  <div className="flex justify-between items-center w-full gap-6">
                    <span className={`text-gray-900 pl-1 font-bold whitespace-nowrap ${isMobile ? 'text-sm' : ''}`} style={{ minWidth: `${maxCountyLength}ch` }}>{county}</span>
                    {!isMobile && (
                      <div className="flex gap-2">
                        <a
                          href={`${prefix}/factsheets/extremeheat/${slugCounty(county)}_extremeheat_2025.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`relative ${isMobile ? 'h-8 px-4' : 'h-6 px-3'}`}
                        >
                          <div className="absolute inset-0 bg-[#fcfcfc] rounded-[15px] shadow-[2px_2px_0px_#338F87]"></div>
                          <div className="relative flex items-center justify-center h-full gap-1">
                            <img src={`${prefix}/images/extremeheaticon-primary.svg`} alt="Extreme Heat" className="w-4 h-4" />
                            <span className={`text-primary ${isMobile ? 'text-[10px]' : 'text-sm'} font-normal`}>Extreme Heat</span>
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary ml-1" />
                          </div>
                        </a>
                        <a
                          href={`${prefix}/factsheets/airpollution/${slugCounty(county)}_airpollution_2025.pdf`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`relative ${isMobile ? 'h-8 px-4' : 'h-6 px-3'}`}
                        >
                          <div className="absolute inset-0 bg-[#fcfcfc] rounded-[15px] shadow-[2px_2px_0px_#338F87]"></div>
                          <div className="relative flex items-center justify-center h-full gap-1">
                            <img src={`${prefix}/images/airpollutionicon-primary.svg`} alt="Air Pollution" className="w-4 h-4" />
                            <span className={`text-primary ${isMobile ? 'text-[10px]' : 'text-sm'} font-normal`}>Air Pollution</span>
                            <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary ml-1" />
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                  {/* For mobile, show buttons below county name with a line break */}
                </div>
                {isMobile && (
                  <div className="flex gap-2 justify-center items-center mb-2">
                    <a
                      href={`${prefix}/factsheets/extremeheat/${slugCounty(county)}_extremeheat_2025.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative h-8 px-4"
                    >
                      <div className="absolute inset-0 bg-[#fcfcfc] rounded-[15px] shadow-[2px_2px_0px_#338F87]"></div>
                      <div className="relative flex items-center justify-center h-full gap-1">
                        <img src={`${prefix}/images/extremeheaticon-primary.svg`} alt="Extreme Heat" className="w-4 h-4" />
                        <span className="text-primary text-[10px] font-normal">Extreme Heat</span>
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary ml-1" />
                      </div>
                    </a>
                    <a
                      href={`${prefix}/factsheets/airpollution/${slugCounty(county)}_airpollution_2025.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative h-8 px-4"
                    >
                      <div className="absolute inset-0 bg-[#fcfcfc] rounded-[15px] shadow-[2px_2px_0px_#338F87]"></div>
                      <div className="relative flex items-center justify-center h-full gap-1">
                        <img src={`${prefix}/images/airpollutionicon-primary.svg`} alt="Air Pollution" className="w-4 h-4" />
                        <span className="text-primary text-[10px] font-normal">Air Pollution</span>
                        <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-primary ml-1" />
                      </div>
                    </a>
                  </div>
                )}
                 {idx < filtered.length - 1 && <Divider />}
               </React.Fragment>
             ))}
          </SimpleBar>


        </div>
      </div>
    </div>
	
  );
}
