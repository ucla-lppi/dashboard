import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Papa from 'papaparse';
// Determine asset prefix (e.g. '/dashboard')
const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
const geoJsonUrl = `${prefix}/data/ca_counties.geojson`;
const DEFAULT_MAP_HEIGHT = 551;
// helper to build fact-sheet filenames
const slugCounty = name => name.replace(/\s+/g, '_');

// Tooltip component for displaying county information
function MapTooltip({ county, x, y, hasFactSheet, onTooltipEnter, onTooltipLeave, arrowPosition = 'top-left' }) {
  const arrowPositionClass = {
    'top-left': 'left-0 top-0',
    'top-right': 'right-0 top-0',
    'top-center': 'left-1/2 top-0 transform -translate-x-1/2'
  }[arrowPosition] || 'left-0 top-0';

  const arrowSVG = {
    'top-left': <polygon points="0,0 39,0 0,12" fill="#005587" />,
    'top-right': <polygon points="39,0 0,0 39,12" fill="#005587" />,
    'top-center': <polygon points="0,0 39,0 19.5,12" fill="#005587" />
  }[arrowPosition] || <polygon points="0,0 39,0 0,12" fill="#005587" />;

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
      {/* Blue triangle accent */}
      <div className={`absolute w-10 h-3 pointer-events-none ${arrowPositionClass}`}>
        <svg width="39" height="12" viewBox="0 0 39 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          {arrowSVG}
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
          <a href={`${prefix}/factsheets/extremeheat/${slugCounty(county)}_extremeheat_2025.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-[#005587] rounded-[15px] px-4 py-1 shadow-[2px_2px_0px_#30303080] focus:outline-none">
            <img src={`${prefix}/images/extremeheaticon-white.svg`} alt="Extreme Heat" className="w-5 h-5 mr-2" />
            <svg className="w-4 h-4 ml-1" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
          <a href={`${prefix}/factsheets/airpollution/${slugCounty(county)}_airpollution_2025.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-[#005587] rounded-[15px] px-4 py-1 shadow-[2px_2px_0px_#30303080] focus:outline-none">
            <img src={`${prefix}/images/airpollutionicon-white.svg`} alt="Air Pollution" className="w-5 h-5 mr-2" />
            <svg className="w-4 h-4 ml-1" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      ) : (
        <div className="flex flex-col items-center w-full mt-1">
          <div className="w-full text-base text-center font-normal font-Lexend_Deca text-black">N/A. See <a href={`${prefix}/faqs`} target="_blank" rel="noopener noreferrer" className="text-[#005587] underline">FAQ</a>. <br></br>See California Factsheets.</div>
        <div className="flex flex-row items-center justify-center gap-4 w-full mt-2">
          <a href={`${prefix}/factsheets/extremeheat/California_state_extremeheat_2025.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-[#005587] rounded-[15px] px-4 py-1 shadow-[2px_2px_0px_#30303080] focus:outline-none">
            <img src={`${prefix}/images/extremeheaticon-white.svg`} alt="Extreme Heat" className="w-5 h-5 mr-2" />
            <svg className="w-4 h-4 ml-1" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
          <a href={`${prefix}/factsheets/airpollution/California_state_airpollution_2025.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center bg-[#005587] rounded-[15px] px-4 py-1 shadow-[2px_2px_0px_#30303080] focus:outline-none">
            <img src={`${prefix}/images/airpollutionicon-white.svg`} alt="Air Pollution" className="w-5 h-5 mr-2" />
            <svg className="w-4 h-4 ml-1" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
        </div>
      )}
    </div>
  );
}

export default function CaliforniaMap({ mapHeightOverride }) {
  const mapRef = useRef(null);
  const svgRef = useRef(null); // Keep a reference to the SVG element
  const tooltipRef = useRef(null); // Keep a reference to the tooltip
  const stickyRef = useRef(false); // Ref for sticky state (avoids stale closures in D3 handlers)
  const stickyCountyRef = useRef(null); // Tracks which county is currently sticky
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);
  const [tooltip, setTooltip] = React.useState({ show: false, county: '', x: 0, y: 0, hasFactSheet: false, arrowPosition: 'top-left' });
  const [countiesWithFactSheets, setCountiesWithFactSheets] = React.useState([]);
  const [hovered, setHovered] = React.useState(false); // Track if mouse is over map or tooltip
  const [tooltipHovered, setTooltipHovered] = React.useState(false); // Track if mouse is over tooltip
  const [sticky, setSticky] = React.useState(false); // Whether tooltip is pinned by a click

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

  const mapHeightValue = Number(mapHeightOverride ?? DEFAULT_MAP_HEIGHT);

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
      const height = mapHeightValue; // Fixed height to match the FancyBoxes column

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
          .attr("stroke-width", 0.5);

        // Helper: position tooltip and determine arrow direction
        const tooltipPos = (feature) => {
          const bounds = path.bounds(feature);
          const centroid = path.centroid(feature);
          const svgNode = svgRef.current.node();
          const svgRect = svgNode.getBoundingClientRect();
          const containerRect = mapRef.current.getBoundingClientRect();
          const scaleX = svgRect.width  / +svgNode.getAttribute('width');
          const scaleY = svgRect.height / +svgNode.getAttribute('height');
          const tooltipWidth = 257;
          const tooltipHeight = 96;
          const pad = 8;
          const isMobileView = window.innerWidth < 540;
          
          let x, y, arrowPosition = 'top-left';
          if (isMobileView) {
            // On mobile, center horizontally on the map
            x = (containerRect.width - tooltipWidth) / 2;
            // Position below the centroid
            const centroidScreenX = centroid[0] * scaleX + (svgRect.left - containerRect.left);
            const cy = centroid[1] * scaleY + (svgRect.top - containerRect.top);
            y = cy + 12;
            y = Math.max(pad, Math.min(y, containerRect.height - tooltipHeight - pad));
            
            // Determine arrow position based on centroid relative to tooltip center
            const tooltipCenterX = x + tooltipWidth / 2;
            if (centroidScreenX < tooltipCenterX) {
              arrowPosition = 'top-left';
            } else {
              arrowPosition = 'top-right';
            }
          } else {
            // On desktop, position near centroid with offset
            const cx = centroid[0] * scaleX + (svgRect.left - containerRect.left);
            const cy = centroid[1] * scaleY + (svgRect.top - containerRect.top);
            const leftEdge = bounds[0][0] * scaleX + (svgRect.left - containerRect.left);
            x = cx + 4;
            y = cy;
            // If it overflows the right edge, flip to the left of the centroid
            if (x + tooltipWidth > containerRect.width - pad) {
              x = leftEdge - tooltipWidth - pad;
              arrowPosition = 'top-right';
            } else {
              arrowPosition = 'top-left';
            }
            x = Math.max(pad, Math.min(x, containerRect.width  - tooltipWidth  - pad));
            y = Math.max(pad, y); // Allow y to extend beyond containerHeight - tooltipHeight
          }
          return { x, y, arrowPosition };
        };

        svgRef.current.selectAll("path")
          .on("click", (event, d) => {
            event.stopPropagation();
            const countyName = d.properties.name;
            const hasFactSheet = countiesWithFactSheets.includes(countyName);
            // Toggle off if clicking the already-sticky county
            if (stickyRef.current && stickyCountyRef.current === countyName) {
              stickyRef.current = false;
              stickyCountyRef.current = null;
              setSticky(false);
              setHovered(false);
              setTooltip(tt => ({ ...tt, show: false }));
              d3.select(event.target).attr("fill", hasFactSheet ? "#338f87" : "#ccc");
              return;
            }
            const { x, y, arrowPosition } = tooltipPos(d);
            // Reset all counties then highlight the clicked one
            svgRef.current.selectAll("path").each(function(pd) {
              const has = countiesWithFactSheets.includes(pd.properties.name);
              d3.select(this).attr("fill", has ? "#338f87" : "#ccc");
            });
            d3.select(event.target).attr("fill", hasFactSheet ? "#2a6e67" : "#aaa");
            stickyRef.current = true;
            stickyCountyRef.current = countyName;
            setSticky(true);
            setHovered(true);
            setTooltip({ show: true, county: countyName, x, y, hasFactSheet, fixedX: x, fixedY: y, arrowPosition });
          })
          .on("mouseenter", (event, d) => {
            if (stickyRef.current) return; // Ignore hover when sticky
            setHovered(true);
            const countyName = d.properties.name;
            const hasFactSheet = countiesWithFactSheets.includes(countyName);
            const { x, y, arrowPosition } = tooltipPos(d);
            setTooltip({ show: true, county: countyName, x, y, hasFactSheet, fixedX: x, fixedY: y, arrowPosition });
            // On hover, darken the base color
            d3.select(event.target).attr("fill", hasFactSheet ? "#2a6e67" : "#aaa");
          })
          .on("mouseleave", (event, d) => {
            if (stickyRef.current) return; // Keep highlight and tooltip when sticky
            setHovered(false);
            // Restore base fill
            const countyName = d.properties.name;
            const has = countiesWithFactSheets.includes(countyName);
            d3.select(event.target).attr("fill", has ? "#338f87" : "#ccc");
          });
        // If a county is currently sticky, re-apply its highlight after redraw
        if (stickyRef.current && stickyCountyRef.current) {
          svgRef.current.selectAll("path")
            .filter(d => d.properties.name === stickyCountyRef.current)
            .attr("fill", countiesWithFactSheets.includes(stickyCountyRef.current) ? "#2a6e67" : "#aaa");
        }
        setIsMapLoaded(true); // Set map loaded after rendering
      });
    };

    // Initial render
    renderMap();

    // Re-render on window resize
    window.addEventListener("resize", renderMap);

    // On mobile, orientation changes can cause stale getBoundingClientRect values.
    // Re-render after a brief delay to allow the browser to reflow, and dismiss
    // any open tooltip so it doesn't appear at a position from the previous orientation.
    const handleOrientationChange = () => {
      setTooltip((tt) => ({ ...tt, show: false }));
      setHovered(false);
      setTimeout(renderMap, 150);
    };
    window.addEventListener("orientationchange", handleOrientationChange);
    if (typeof screen !== "undefined" && screen.orientation) {
      screen.orientation.addEventListener("change", handleOrientationChange);
    }

    // Cleanup to prevent duplicate maps and tooltips
    return () => {
      window.removeEventListener("resize", renderMap);
      window.removeEventListener("orientationchange", handleOrientationChange);
      if (typeof screen !== "undefined" && screen.orientation) {
        screen.orientation.removeEventListener("change", handleOrientationChange);
      }
      if (tooltipRef.current) {
        tooltipRef.current.remove();
        tooltipRef.current = null;
      }
    };
  }, [countiesWithFactSheets, mapHeightValue]);

  // Close handler called by the sticky tooltip's × button
  const handleClose = React.useCallback(() => {
    stickyRef.current = false;
    stickyCountyRef.current = null;
    setSticky(false);
    setHovered(false);
    setTooltipHovered(false);
    setTooltip(tt => ({ ...tt, show: false }));
    if (svgRef.current) {
      svgRef.current.selectAll("path").each(function(pd) {
        const has = countiesWithFactSheets.includes(pd.properties.name);
        d3.select(this).attr("fill", has ? "#338f87" : "#ccc");
      });
    }
  }, [countiesWithFactSheets]);

  // Tooltip close on leave logic
  useEffect(() => {
    if (!hovered && !tooltipHovered && !sticky) {
      setTooltip((tt) => ({ ...tt, show: false }));
    }
  }, [hovered, tooltipHovered, sticky]);

  return (
        <div
          className="relative w-full sm:mt-4 md:mt-8 lg:mt-0"
          style={{ height: `${mapHeightValue}px` }}
        >
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full relative">
        {tooltip.show && (
          <MapTooltip
            {...tooltip}
            x={tooltip.fixedX}
            y={tooltip.fixedY}
            arrowPosition={tooltip.arrowPosition}
            onTooltipEnter={() => setTooltipHovered(true)}
            onTooltipLeave={() => setTooltipHovered(false)}
          />
        )}
      </div>
      {/* Legend (real, only if loaded) */}
      {isMapLoaded && (
        <div className="hidden sm:block absolute top-4 right-1 bg-white p-4 rounded-lg border-2 border-primary pointer-events-none">
          <div className="flex items-center mb-2">
            <div className="flex items-center justify-center bg-primary rounded-full w-[60px] h-7 min-w-[48px] min-h-[28px] mr-2">
              <img
                src={`${prefix}/images/extremeheaticon-white.svg`}
                alt="Extreme Heat Icon"
                className="w-5 h-5"
              />
            </div>
            <span className="text-sm font-medium">Extreme Heat Factsheet</span>
          </div>
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-primary rounded-full w-[60px] h-7 min-w-[48px] min-h-[28px] mr-2">
              <img
                src={`${prefix}/images/airpollutionicon-white.svg`}
                alt="Air Pollution Icon"
                className="w-5 h-5"
              />
            </div>
            <span className="text-sm font-medium">Air Pollution Factsheet</span>
          </div>
        </div>
      )}
    </div>
  );
}