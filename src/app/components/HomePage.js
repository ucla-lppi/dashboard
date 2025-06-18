import React, { useState, useEffect } from "react";
import CaliforniaMap from "./CaliforniaMap";
import FancyBoxes from "./FancyBoxes";
export const metadata = { title: 'Latino Climate and Health Dashboard' };

export default function HomePage() {
  const [isFancyBoxesLoaded, setIsFancyBoxesLoaded] = useState(false); // Track FancyBoxes loading state
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Simple mobile device check via user agent
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
  }, []);

  const handleFancyBoxesLoaded = () => {
    setIsFancyBoxesLoaded(true);
    // Removed delay and map readiness logic; map loads on page load now
  };

  return (
    <div className="flex flex-col p-6 space-y-8">
      {/* Title and Instruction spanning both columns */}
      <div className={`${!isMobile ? 'max-w-max mx-0' : ''}`}> 
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold text-primary">
            {isMobile ? 'Climate and Health Dashboard' : 'California County Factsheets'}
          </h1>
          {isMobile ? (
            <div className="flex items-center justify-center w-full mt-6 mb-6">
              <button
                onClick={() => document.getElementById('county-profiles').scrollIntoView({ behavior: 'smooth' })}
                className="shadow-[0px_4px_8px_#0002] rounded-lg w-full"
              >
                <div className="relative rounded-lg bg-gradient-to-b from-primary to-accents flex items-center justify-center px-6 py-4">
                  <span className="text-white text-xl font-semibold text-center leading-tight font-Lexend_Deca">
                    Jump to County Factsheets
                  </span>
                </div>
              </button>
            </div>
          ) : (
           <span className="text-[#2f2f2f] text-xl font-bold font-Lexend_Deca block mt-2 mb-4">
             Click on a county on the map to view its factsheets
           </span>
          )}
        </div>
      </div>
      {/* Stats and Map Section: nested layout */}
      <div className={isMobile ? 'flex flex-col space-y-8' : 'grid grid-cols-[1fr_400px] gap-x-8'}>
        {/* Map Section */}
        <div className="relative flex flex-col">
          <div className="flex flex-col sm:justify-start lg:justify-center h-full">
            <CaliforniaMap />
          </div>
          <div className="flex flex-col items-start space-y-2">
            <div className="flex flex-col items-center">
              {/* Hide this button on mobile view */}
              {!isMobile && (
                <button onClick={() => document.getElementById('county-profiles').scrollIntoView({ behavior: 'smooth' })} className="text-m font-semibold text-black mb-1 text-center">
                  jump to <br />county factsheets
                </button>
              )}
              <button onClick={() => document.getElementById('county-profiles').scrollIntoView({ behavior: 'smooth' })} className="bg-tertiary text-white p-3 rounded-full shadow-md" aria-label="Go down">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="#000" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
        {/* Stats and FancyBoxes Section */}
        <div className="flex flex-col text-right justify-start max-w-[400px]">
          <div className={`flex items-center ${isMobile ? 'justify-center w-full' : 'justify-center'} mb-6 mt-0`}>
            <div className="shadow-[0px_4px_8px_#0002] rounded-lg">
              <div className={`relative rounded-lg bg-gradient-to-b from-primary to-accents flex items-center justify-center px-6 py-4 ${isMobile ? 'w-full' : 'min-w-[220px]'}`}>
                <div className="text-white text-xl font-semibold text-center leading-tight font-Lexend_Deca">
                  California Latino<br />Neighborhood Statistics
                </div>
              </div>
            </div>
          </div>
          <FancyBoxes onLoaded={handleFancyBoxesLoaded} />
        </div>
      </div>
    </div>
  );
}