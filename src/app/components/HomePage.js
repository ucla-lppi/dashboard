import React, { useState } from "react";
import CaliforniaMap from "./CaliforniaMap";
import FancyBoxes from "./FancyBoxes";

export default function HomePage() {
  const [isFancyBoxesLoaded, setIsFancyBoxesLoaded] = useState(false); // Track FancyBoxes loading state
  // Removed isMapReady state

  const handleFancyBoxesLoaded = () => {
    setIsFancyBoxesLoaded(true);
    // Removed delay and map readiness logic; map loads on page load now
  };

  return (
    <div className="grid grid-cols-2 gap-8 p-6 min-h-screen items-start">
      {/* Title and Instruction spanning both columns */}
      <div className="col-span-2">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold text-primary">
            California County Profiles
          </h1>
          <span className="text-[#2f2f2f] text-xl font-bold font-Lexend_Deca block mt-0 mb-1">
            Click on a county on the map to view its County Wellness Profile
          </span>
        </div>
      </div>
      {/* Left Column: Map */}
      <div className="relative flex flex-col">
        {/* Map: Always loaded */}
        <div className="flex flex-col sm:justify-start lg:justify-center h-full">
          <CaliforniaMap />
        </div>
        {/* Jump to county profiles button just below the map, left-aligned group but text/arrow centered within group */}
        <div className="flex flex-col items-start space-y-2">
          <div className="flex flex-col items-center">
            <button
              onClick={() =>
                document
                  .getElementById('county-profiles')
                  .scrollIntoView({ behavior: 'smooth' })
              }
              className="text-m font-semibold text-black mb-1 text-center"
            >
              jump to <br />county profiles
            </button>
            <button
              onClick={() =>
                document
                  .getElementById('county-profiles')
                  .scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-tertiary text-white p-3 rounded-full shadow-md"
              aria-label="Go down"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col text-right justify-start">
        {/* Neighborhood Statistics Box - top of right column */}
        <div className="flex items-center justify-end mb-6 mt-0">
          <div className="shadow-[0px_4px_8px_#0002] rounded-lg">
            <div className="relative rounded-lg bg-gradient-to-b from-primary to-accents flex items-center justify-center px-6 py-4 min-w-[220px]">
              <div className="text-white text-xl font-semibold text-center leading-tight font-Lexend_Deca">
                California Latino<br />Neighborhood Statistics
              </div>
            </div>
          </div>
        </div>
        {/* Fancy Boxes */}
        <FancyBoxes onLoaded={handleFancyBoxesLoaded} />
      </div>

	  {/* California County Profile Section */}
    </div>
  );
}