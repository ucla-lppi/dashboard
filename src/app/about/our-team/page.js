"use client";

import React from 'react';
import teamData from '@/generated/team.json';
import CircleImage from '../../components/CircleImage';

const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';

export default function OurTeamPage() {
  const members = teamData.filter(r => {
    const hasName = (r.first_name && r.first_name.trim()) || (r.last_name && r.last_name.trim());
    return hasName && r.image_link && r.image_link.trim();
  });
  return (
    <main className="bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_var(--quaternary-color)] h-auto border-0 p-4 sm:p-6 max-w-screen-xl mx-auto px-4 py-8">
      <aside className="py-8 bg-white">
        <div className="container px-4 max-w-7xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-primary">Our Team</h2>
          </div>
        </div>
        <div className="py-4 px-4 max-w-screen-xl text-center lg:py-16 lg:px-6">
          <div className="mb-4 max-w-screen-sm lg:mb-16"></div>
          <div className="flex flex-wrap justify-center gap-12 bg-white">
            {members.map((m,i) => (
              <div key={i} className="w-[220px] text-center text-gray-900">
                <div className="mb-4" style={{width:220, height:220}}>
                  <CircleImage
                    src={m.image_link}
                    alt={`${m.first_name || ''} ${m.last_name || ''}`}
                    size={220}
                  />
                </div>
                <h3 className="mb-1 text-xl font-semibold font-Lexend_Deca text-primary">
                  {(m.title ? `${m.title} ` : '') + (m.first_name || '') + (m.last_name ? ' ' + m.last_name : '')}
                </h3>
                <p className="text-base font-medium font-montserrat text-gray-700">
                  {m.role || ''}
                </p>
                <p className="text-base font-montserrat text-gray-500">
                  {m.organization || ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </main>
  );
}
