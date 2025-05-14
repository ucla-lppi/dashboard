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
    <div className="grid grid-cols-2 gap-8 p-6 min-h-screen items-start"> {/* Align columns horizontally */}
      {/* Left Column */}
      <div className="relative flex flex-col space-y-8">
        {/* Title Section */}
        <div className="flex items-center h-16"> {/* Ensure consistent height */}
          <h1 className="text-3xl font-bold text-primary">
            California County Profiles
          </h1>
        </div>
        <p className="text-gray-600 mt-2">
          Click on a county on the map to view its County Wellness Profile
        </p>

        {/* Map: Always loaded */}
        <div className="flex flex-col sm:justify-start lg:justify-center h-full"> {/* Responsive alignment */}
          <CaliforniaMap />
        </div>
      </div>

      {/* Right Column */}
      <div className="flex flex-col space-y-4 text-right justify-end"> {/* Right-align the column */}
        {/* Title */}
        <div className="flex items-center h-16 justify-end"> {/* Ensure consistent height */}
          <h2 className="headline headline--medium t-right font-bold">
            <br />
            <span className="text-primary text-3xl leading-tight">
              California Latino
            </span><br />
            Neighborhood Statistics
          </h2>
        </div>

        {/* Fancy Boxes */}
        <FancyBoxes onLoaded={handleFancyBoxesLoaded} />
      </div>

	  {/* California County Profile Section */}
    </div>
  );
}