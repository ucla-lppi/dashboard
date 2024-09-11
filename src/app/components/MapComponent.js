import { useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import { json } from 'd3-fetch';

export default function MapComponent() {
  useEffect(() => {
    // Initialize MapLibre GL map
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-119.4179, 36.7783], // Center of California
      zoom: 6
    });

    map.on('load', () => {
      console.log('Map loaded successfully');

      // Add counties layer
      json('/data/ca_counties_simplified.geojson')
        .then(geojson => {
          console.log('GeoJSON loaded successfully', geojson);

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
              'fill-opacity': 0.4
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

          // Show county name on hover
          map.on('mousemove', 'counties-layer', (e) => {
            console.log('Mouse move event triggered');
            if (e.features.length > 0) {
              const feature = e.features[0];
              map.getCanvas().style.cursor = 'pointer';
              const coordinates = e.lngLat;
              const countyName = feature.properties.NAME;

              console.log('County hovered:', countyName);

              // Ensure that if the popup is already open, it is removed first
              if (map.getLayer('county-popup')) {
                map.removeLayer('county-popup');
                map.removeSource('county-popup');
              }

              // Add popup layer
              map.addLayer({
                id: 'county-popup',
                type: 'symbol',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'FeatureCollection',
                    features: [{
                      type: 'Feature',
                      geometry: {
                        type: 'Point',
                        coordinates: [coordinates.lng, coordinates.lat]
                      },
                      properties: {
                        name: countyName
                      }
                    }]
                  }
                },
                layout: {
                  'text-field': ['get', 'name'],
                  'text-size': 12,
                  'text-offset': [0, 1.5],
                  'text-anchor': 'top'
                },
                paint: {
                  'text-color': '#000000'
                }
              });
            }
          });

          map.on('mouseleave', 'counties-layer', () => {
            console.log('Mouse leave event triggered');
            map.getCanvas().style.cursor = '';
            if (map.getLayer('county-popup')) {
              map.removeLayer('county-popup');
              map.removeSource('county-popup');
            }
          });
        })
        .catch(error => console.error('Error loading GeoJSON:', error));
    });

    map.on('error', (e) => {
      console.error('Map loading error:', e);
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div id="map" className="w-full" style={{ height: '50vh', marginTop: '64px' }}></div>
  );
}