import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import { json } from 'd3-fetch';

export default function MapComponent() {
  const mapContainerRef = useRef(null);
  const popupRef = useRef(null);

  useEffect(() => {
    // Initialize MapLibre GL map
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-119.4179, 36.7783], // Center of California
      zoom: 6,
      attributionControl: false // Disable the default attribution control
    });

    let hoveredStateId = null;

    map.on('load', () => {
      console.log('Map loaded successfully');

      // Add counties layer
      json('/data/ca_counties_simplified.geojson')
        .then(geojson => {
          console.log('GeoJSON loaded successfully', geojson);

          // Ensure each feature has a unique id using the 'ansi' or 'abcode' field
          geojson.features.forEach((feature, index) => {
            if (!feature.id) {
              feature.id = feature.properties.ansi || feature.properties.abcode || index;
            }
          });

          map.addSource('counties', {
            type: 'geojson',
            data: geojson
          });

          map.addLayer({
            id: 'counties-layer',
            type: 'fill',
            source: 'counties',
            paint: {
              'fill-color': '#888888',
              'fill-opacity': 0.4,
              'fill-outline-color': '#2774AE' // UCLA Blue
            }
          });

          map.addLayer({
            id: 'counties-borders',
            type: 'line',
            source: 'counties',
            paint: {
              'line-color': '#000000',
              'line-width': 1
            }
          });

          console.log('Layers added successfully');

          // Fit the map to the GeoJSON layer
          const bounds = new maplibregl.LngLatBounds();
          geojson.features.forEach(feature => {
            feature.geometry.coordinates.forEach(coordSet => {
              coordSet.forEach(coord => {
                bounds.extend(coord);
              });
            });
          });
          map.fitBounds(bounds, { padding: 20 });

          // Disable map panning after fitting to bounds
          map.dragPan.disable();
          // Disable map zooming
          map.scrollZoom.disable();

          // Show county name on hover and highlight the county
          map.on('mousemove', 'counties-layer', (e) => {
            console.log('Mouse move event triggered');
            if (e.features.length > 0) {
              const feature = e.features[0];
              map.getCanvas().style.cursor = 'pointer';
              const coordinates = e.lngLat;
              const countyName = feature.properties.name;
              const indicatorSummary = 'Indicator summary (can be high, low)'; // Placeholder for indicator summary
              const countyUrl = 'https://dashboard.myfuturenc.org/wp-content/uploads/county-profiles/Jackson_County.pdf'; // Placeholder for county URL

              console.log('County hovered:', countyName);

              // Set the popup content and position
              const popup = popupRef.current;
              popup.innerHTML = `
                <strong>${countyName}</strong><br>
                index indicator: ${indicatorSummary}<br>
                <span class="c-blue"><strong>Click county for more details</strong></span>
              `;
              popup.style.display = 'block';
              popup.style.left = `${e.point.x + 10}px`;
              popup.style.top = `${e.point.y + 10}px`;

              // Highlight the hovered county
              if (hoveredStateId !== null) {
                map.setFeatureState(
                  { source: 'counties', id: hoveredStateId },
                  { hover: false }
                );
              }
              hoveredStateId = feature.id;
              map.setFeatureState(
                { source: 'counties', id: hoveredStateId },
                { hover: true }
              );
            }
          });

          map.on('mouseleave', 'counties-layer', () => {
            console.log('Mouse leave event triggered');
            map.getCanvas().style.cursor = '';
            const popup = popupRef.current;
            popup.style.display = 'none';

            // Remove highlight from the previously hovered county
            if (hoveredStateId !== null) {
              map.setFeatureState(
                { source: 'counties', id: hoveredStateId },
                { hover: false }
              );
              hoveredStateId = null;
            }
          });

          // Add a layer to highlight the hovered county
          map.addLayer({
            id: 'counties-highlight',
            type: 'fill',
            source: 'counties',
            paint: {
              'fill-color': '#FFD100', // UCLA Gold
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.75,
                0
              ]
            }
          });
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
    });

    map.on('error', (e) => {
      console.error('Map loading error:', e);
    });

    // Handle container resize
    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      map.remove();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="text-center my-4">
        <div className="text-3xl font-bold">California County Profiles</div>
        <div className="text-xl text-gray-600">Click to view California County Wellness Profiles</div>
      </div>
      <div ref={mapContainerRef} id="map" className="w-full" style={{ height: '50vh', marginTop: '16px', position: 'relative' }}>
        <div ref={popupRef} id="popup" style={{ display: 'none', position: 'absolute', backgroundColor: 'white', border: '1px solid black', padding: '5px', pointerEvents: 'none' }}></div>
      </div>
    </div>
  );
}