"use client";
import React from 'react';

// CSS-based dynamic full-width divider with absolute positioned circular caps
export default function Divider() {
  return (
    <div className="relative my-2">
      <hr
        className="
          absolute inset-x-2 top-1/2 -translate-y-1/2
          border-t-[2px] border-[#333333]
          opacity-50
        "
      />
    </div>
  );
}
