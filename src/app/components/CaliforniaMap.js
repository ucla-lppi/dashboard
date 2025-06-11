import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Papa from 'papaparse';
import Link from 'next/link';

// Determine asset prefix (e.g. '/dashboard')
const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
const geoJsonUrl = `${prefix}/data/ca_counties.geojson`;
const options = {
	mapHeight: '551'
};
// helper to build fact-sheet filenames
const slugCounty = name => name.replace(/\s+/g, '_');

// Tooltip component for displaying county information
function MapTooltip({ county, x, y, hasFactSheet, onTooltipEnter, onTooltipLeave }) {
  return (
    <div
      className={
        hasFactSheet
          ? 'absolute z-50 w-[257px] h-[96px] rounded-[10px] shadow-[2px_2px_0px_#30303080] border border-[#005587] bg-white flex flex-col items-center justify-start pt-2 pb-3 overflow-visible select-none'
          : 'absolute z-50 w-[257px] h-54 bg-white rounded-[0px_10px_10px_10px] border border-solid border-[#005587] shadow-[2px_2px_0px_#30303080] text-black flex flex-col items-center justify-start pt-2 pb-3 overflow-visible select-none'
      }
      style={{ left: x, top: y, pointerEvents: 'auto', position: 'absolute' }}
      onMouseEnter={onTooltipEnter}
      onMouseLeave={onTooltipLeave}
    >
      {/* Blue triangle accent (SVG or CSS) */}
      <div className="absolute left-0 top-0 w-10 h-3 pointer-events-none">
        <svg width="39" height="12" viewBox="0 0 39 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="0,0 39,0 0,12" fill="#005587" />
        </svg>
      </div>
      {/* County name row */}
      <div className="w-full flex flex-col items-center mt-2">
        <span className="font-Lexend_Deca font-bold text-lg text-[#2f2f2f] text-center block whitespace-nowrap overflow-hidden text-ellipsis">
          {county} County
        </span>
      </div>
      {hasFactSheet ? (
        <div className="flex flex-row items-center justify-center gap-4 w-full mt-2">
          <a href={`${prefix}/factsheets/extremeheat/${slugCounty(county)}_extremeheat.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-[#005587] rounded-[15px] px-4 py-1 shadow-[2px_2px_0px_#30303080] focus:outline-none">
            <img src={`${prefix}/images/extremeheaticon-white.svg`} alt="Extreme Heat" className="w-5 h-5 mr-2" />
            <svg className="w-4 h-4 ml-1" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
          <a href={`${prefix}/factsheets/airpollution/${slugCounty(county)}_airpollution.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-[#005587] rounded-[15px] px-4 py-1 shadow-[2px_2px_0px_#30303080] focus:outline-none">
            <img src={`${prefix}/images/airpollutionicon-white.svg`} alt="Air Pollution" className="w-5 h-5 mr-2" />
            <svg className="w-4 h-4 ml-1" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full mt-1">
          <div className="w-full text-base text-center font-normal font-Lexend_Deca text-black">No fact sheet available.</div>
          <Link href="/faqs" className="flex items-center bg-[#005587] rounded-[15px] px-4 py-0 shadow-[2px_2px_0px_#30303080] focus:outline-none mt-3">
            <span className="text-white text-lg font-medium font-Lexend_Deca">FAQ</span>
            <svg className="w-6 h-[19px] ml-2" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </Link>
        </div>
      )}
    </div>
  );
}

export default function CaliforniaMap() {
  const mapRef = useRef(null);
  const svgRef = useRef(null); // Keep a reference to the SVG element
  const tooltipRef = useRef(null); // Keep a reference to the tooltip
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);
  const [tooltip, setTooltip] = React.useState({ show: false, county: '', x: 0, y: 0, hasFactSheet: false });
  const [countiesWithFactSheets, setCountiesWithFactSheets] = React.useState([]);
  const [hovered, setHovered] = React.useState(false); // Track if mouse is over map or tooltip
  const [tooltipHovered, setTooltipHovered] = React.useState(false); // Track if mouse is over tooltip

  // Fetch and parse the CSV on mount
  useEffect(() => {
    Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=1862778319&single=true&output=csv', {
      download: true,
      header: true,
      complete: (results) => {
        // The CSV only has a 'county' column; all non-empty values are counties with fact sheets
        const counties = results.data
          .map(row => row['county'] && row['county'].trim())
          .filter(Boolean);
        setCountiesWithFactSheets(counties);
      }
    });
  }, []);

  useEffect(() => {
    // Append the SVG element only once
    if (!svgRef.current) {
      svgRef.current = d3
        .select(mapRef.current)
        .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet") // Maintain aspect ratio
        .classed("w-full h-full", true); // Make the SVG responsive
    }

    // Append the tooltip only once
    if (!tooltipRef.current) {
      tooltipRef.current = d3
        .select("body")
        .append("div")
        .style("position", "absolute")
        .style("background", "white")
        .style("padding", "5px")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("box-shadow", "0 4px 6px rgba(0, 0, 0, 0.1)")
        .style("opacity", 0);
    }

    const renderMap = () => {
      const container = mapRef.current.getBoundingClientRect();
      const width = container.width;
      const height = options.mapHeight; // Fixed height to match the FancyBoxes column

      d3.json(geoJsonUrl).then((geojson) => {
        // Configure the projection
        const projection = d3
          .geoMercator()
          .fitSize([width, height], geojson);

        const path = d3.geoPath().projection(projection);

        // Clear only the paths, not the entire SVG
        svgRef.current.selectAll("path").remove();

        // Set the SVG dimensions
        svgRef.current
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("width", width)
          .attr("height", height);

        // Draw the counties
        svgRef.current
          .selectAll("path")
          .data(geojson.features)
          .enter()
          .append("path")
          .attr("d", path)
          // Color counties with fact sheets green, others gray
          .attr("fill", d => countiesWithFactSheets.includes(d.properties.name) ? "#338f87" : "#ccc")
          .attr("stroke", "white")
          .attr("stroke-width", 0.5)
          .on("mouseenter", (event, d) => {
            setHovered(true);
            const countyName = d.properties.name;
            const hasFactSheet = countiesWithFactSheets.includes(countyName);
            // Get centroid in SVG coordinates
            const centroid = path.centroid(d);
            // Get SVG and map container bounding rects
            const svgNode = svgRef.current.node();
            const svgRect = svgNode.getBoundingClientRect();
            const containerRect = mapRef.current.getBoundingClientRect();
            // Calculate scale factors (SVG may be scaled to fit container)
            const scaleX = svgRect.width / +svgNode.getAttribute('width');
            const scaleY = svgRect.height / +svgNode.getAttribute('height');
            // Offset so the arrow (top left) points to the centroid
            // Adjust these values as needed for best visual alignment
            const arrowOffsetX = 0; // px right from centroid
            const arrowOffsetY = 0; // px down from centroid
            const x = centroid[0] * scaleX + (svgRect.left - containerRect.left) + arrowOffsetX;
            const y = centroid[1] * scaleY + (svgRect.top - containerRect.top) + arrowOffsetY;
            setTooltip({
              show: true,
              county: countyName,
              x,
              y,
              hasFactSheet,
              fixedX: x,
              fixedY: y
            });
            // On hover, darken the base color
            d3.select(event.target).attr("fill", hasFactSheet ? "#2a6e67" : "#aaa");
          })
          .on("mousemove", (event) => {
            // Do not update tooltip position on mousemove
          })
          .on("mouseleave", (event, d) => {
            setHovered(false);
            // Restore base fill
            const countyName = d.properties.name;
            const has = countiesWithFactSheets.includes(countyName);
            d3.select(event.target).attr("fill", has ? "#338f87" : "#ccc");
          });
        setIsMapLoaded(true); // Set map loaded after rendering
      });
    };

    // Initial render
    renderMap();

    // Re-render on window resize
    window.addEventListener("resize", renderMap);

    // Cleanup to prevent duplicate maps and tooltips
    return () => {
      window.removeEventListener("resize", renderMap);
      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
    };
  }, [countiesWithFactSheets, tooltipHovered]);

  // Tooltip close on leave logic
  useEffect(() => {
    if (!hovered && !tooltipHovered) {
      setTooltip((tt) => ({ ...tt, show: false }));
    }
  }, [hovered, tooltipHovered]);

  return (
    <div
      className="relative w-full sm:mt-4 md:mt-8 lg:mt-0"
      style={{ height: `${options.mapHeight}px` }}
    >
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full relative">
        {tooltip.show && (
          <MapTooltip
            {...tooltip}
            x={tooltip.fixedX}
            y={tooltip.fixedY}
            onTooltipEnter={() => setTooltipHovered(true)}
            onTooltipLeave={() => setTooltipHovered(false)}
          />
        )}
      </div>
      {/* Legend (real, only if loaded) */}
      {isMapLoaded && (
        <div className="absolute top-4 right-1 bg-white p-4 rounded-lg border-2 border-primary">
          <div className="flex items-center mb-2">
            <div className="flex items-center justify-center bg-primary rounded-full w-[60px] h-7 min-w-[48px] min-h-[28px] mr-2">
              <img
                src={`${prefix}/images/extremeheaticon-white.svg`}
                alt="Extreme Heat Icon"
                className="w-5 h-5"
              />
            </div>
            <span className="text-sm font-medium">Extreme Heat Fact Sheet</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-primary rounded-full w-[60px] h-7 min-w-[48px] min-h-[28px] mr-2">
              <img
                src={`${prefix}/images/airpollutionicon-white.svg`}
                alt="Air Pollution Icon"
                className="w-5 h-5"
              />
            </div>
            <span className="text-sm font-medium">Air Pollution Fact Sheet</span>
          </div>
        </div>
      )}
    </div>
  );
}