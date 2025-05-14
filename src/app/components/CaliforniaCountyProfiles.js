"use client";
import React, { useState, useMemo } from 'react';
import Divider from './Divider';
const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

const allCounties = [
  "Alameda","Alpine","Amador","Butte","Calaveras","Colusa","Contra Costa","Del Norte","El Dorado","Fresno",
  "Glenn","Humboldt","Imperial","Inyo","Kern","Kings","Lake","Lassen","Los Angeles","Madera",
  "Marin","Mariposa","Mendocino","Merced","Modoc","Monterey","Napa","Nevada","Orange","Placer",
  "Plumas","Riverside","Sacramento","San Benito","San Bernardino","San Diego","San Francisco","San Joaquin","San Luis Obispo","San Mateo",
  "Santa Barbara","Santa Clara","Santa Cruz","Shasta","Sierra","Siskiyou","Solano","Sonoma","Stanislaus","Sutter",
  "Tehama","Trinity","Tulare","Tuolumne","Ventura","Yolo","Yuba"
];

export default function CaliforniaCountyProfiles() {
  const [search, setSearch] = useState('');
  const filtered = useMemo(() =>
    allCounties.filter(c => c.toLowerCase().includes(search.toLowerCase())), [search]
  );

  return (
    <div className="bg-tertiary p-6 rounded">
      <div id="county-profiles" className="flex gap-6">
        {/* Left Column (25%) */}
        <div className="w-[35%]">
          <p className="text-base text-gray-900 mb-4">
            The Latino Climate and Health Dashboard equips advocates and decision-makers with strategic data on climate and health risks in Latino neighborhoods to support healthier, more resilient communities in California.
            <br/><br/>
            Currently, fact sheets are available for 23 California counties. This is placeholder text.
          </p>
		  <Divider />
			<div className="flex flex-col gap-4 mb-4 p-4">
			  <button className="bg-white font-bold  text-primary px-4 py-2 rounded-[15px] shadow-[2px_2px_0px_#00000040]">
				STATE FACT SHEET
			  </button>
			  <button className="bg-white font-bold text-primary px-4 py-2 rounded-[15px] shadow-[2px_2px_0px_#00000040]">
				FAQS
			  </button>
			</div>
        </div>
        <div className="w-px bg-[#333333] self-stretch"></div>
        {/* Right Column (75%) */}
        <div className="w-[75%]">
          <h2 className="text-xl font-bold text-[28px] text-gray-900 mb-4">List of California County Profiles</h2>
          {/* Search Bar */}
          <div className="flex items-center bg-white rounded-full border border-primary w-full max-w-md mb-4">
            <input
              type="text"
              placeholder="Search for a county"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 text-base placeholder-gray-500 focus:outline-none rounded-l-full"
            />
            <span className="flex items-center justify-center w-10 h-10 bg-primary rounded-r-full">
              <img src={`${prefix}/images/search_icon.svg`} alt="Search" className="w-4 h-4" />
            </span>
          </div>

          {/* Counties List */}
          <div className="rounded max-h-[400px] overflow-y-auto">
			<Divider />
            {filtered.map((county, idx) => (
              <React.Fragment key={county}>
                <div className="flex justify-between items-center px-4 py-2">
                  <span className="text-gray-900">{county}</span>
                  <div className="flex gap-2">
                    <button className="relative w-[205px] h-6">
                      <div className="absolute inset-0 bg-[#fcfcfc] rounded-[15px] shadow-[2px_2px_0px_#338F87]"></div>
                      <div className="relative flex items-center justify-center h-full gap-1">
                        <img src={`${prefix}/images/extremeheaticon.svg`} alt="Extreme Heat" className="w-4 h-4" />
                        <span className="text-primary text-sm font-normal">Extreme Heat</span>
                      </div>
                    </button>
                    <button className="relative w-[205px] h-6">
                      <div className="absolute inset-0 bg-[#fcfcfc] rounded-[15px] shadow-[2px_2px_0px_#338F87]"></div>
                      <div className="relative flex items-center justify-center h-full gap-1">
                        <img src={`${prefix}/images/airpollutionicon.svg`} alt="Air Pollution" className="w-4 h-4" />
                        <span className="text-primary text-sm font-normal">Air Pollution</span>
                      </div>
                    </button>
                  </div>
                </div>
                {idx < filtered.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </div>


        </div>
      </div>
    </div>
	
  );
}
