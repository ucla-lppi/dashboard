import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// Determine asset prefix (e.g. '/dashboard')
const prefix = process.env.NEXT_PUBLIC_ASSET_PREFIX || '';
const geoJsonUrl = `${prefix}/data/ca_counties.geojson`;
const options = {
	mapHeight: '551'
}
export default function CaliforniaMap() {
  const mapRef = useRef(null);
  const svgRef = useRef(null); // Keep a reference to the SVG element
  const tooltipRef = useRef(null); // Keep a reference to the tooltip
  const [isMapLoaded, setIsMapLoaded] = React.useState(false);

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
          .attr("fill", "#ccc")
          .attr("stroke", "white")
          .attr("stroke-width", 0.5)
          .on("mouseover", (event, d) => {
            d3.select(event.target).attr("fill", "#aaa");
            tooltipRef.current
              .style("opacity", 1)
              .html(`<strong>${d.properties.name}</strong>`)
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`);
          })
          .on("mousemove", (event) => {
            tooltipRef.current
              .style("left", `${event.pageX + 10}px`)
              .style("top", `${event.pageY + 10}px`);
          })
          .on("mouseout", (event) => {
            d3.select(event.target).attr("fill", "#ccc");
            tooltipRef.current.style("opacity", 0);
          })
          .on("click", (event, d) => {
            alert(`Clicked on ${d.properties.name}`);
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
  }, []); // Empty dependency array ensures this runs only once

  // Skeleton loader for the map
  const MapSkeleton = () => (
    <div className="relative w-full" style={{ height: `${options.mapHeight}px` }}>
      <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
    </div>
  );

  return (
    <div
      className="relative w-full sm:mt-4 md:mt-8 lg:mt-0"
      style={{ height: `${options.mapHeight}px` }}
    >
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full">
        {!isMapLoaded && <MapSkeleton />}
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