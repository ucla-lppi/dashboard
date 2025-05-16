"use client";
import React from 'react';

// CSS-based dynamic full-width divider with absolute positioned circular caps
export default function Divider() {
  return (
    <div className="relative my-2">
      <hr
        className="absolute inset-x-2 top-1/2 -translate-y-1/2 border-t-[2px] border-[#333333]"
      />
      <span
        className="absolute left-2 top-1/2 -translate-y-1/2 block bg-[#333333] rounded-full w-[8px] h-[8px]"
      />
      <span
        className="absolute right-2 top-1/2 -translate-y-1/2 block bg-[#333333] rounded-full w-[8px] h-[8px]"
      />
    </div>
  );
}
