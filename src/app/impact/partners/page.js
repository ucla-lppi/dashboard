"use client";

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

// export const metadata = {
//   title: 'Impact - Partners',
// };

const partnersCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=563435215&single=true&output=csv';

export default function ImpactPartnersPage() {
  const [members, setMembers] = useState([]);
  useEffect(() => {
    fetch(partnersCsvUrl)
      .then(res => res.text())
      .then(text => {
        Papa.parse(text, { header: true, complete: ({ data }) => {
          setMembers(data.filter(r => r.imageUrl));
        }});
      });
  }, []);
  return (
	<main className="bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0 p-4 sm:p-6 max-w-screen-xl mx-auto px-4 py-8">
	<div className="flex flex-col gap-4">
		<h1 className="text-2xl font-bold text-primary">Partners</h1>
		<div className="mb-4 text-1xl tracking-tight font-bold text-gray-900">Advisory Committee</div>

	  </div>
	  <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-6">
        <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
        </div>
        <div className="flex flex-wrap justify-center gap-12 bg-white">
          {members.map((m,i) => (
            <div key={i} className="w-[220px] text-center text-gray-900">
              <div className="mx-auto mb-4 w-[220px] h-[220px] relative rounded-full overflow-hidden">
                {/* Partner image absolute inside circular boundary */}
                <img src={m.imageUrl} alt={`${m.first_name} ${m.last_name}`} className="absolute inset-0 w-full h-full object-cover" />
                {/* SVG boundary overlay */}
                <img src={`${prefix}/images/partners_icon_boundary.svg`} alt="frame" className="absolute inset-0 w-full h-full" />
              </div>
              <h3 className="mb-1 text-[24px] font-semibold font-montserrat text-primary">
                {m.first_name} {m.last_name}
              </h3>
              <p className="text-[18px] font-medium font-montserrat text-gray-700">
                {m.position}
              </p>
              <p className="text-[18px] font-montserrat text-gray-500">
                {m.organization}
              </p>
            </div>
          ))}
        </div>
      </div>
	</main>
  );
}