# Maintenance guide 

This document explains simple maintenance tasks that don't require coding.

## Factsheets
- Where they live:
  - `public/factsheets/extremeheat/`
  - `public/factsheets/airpollution/`
- Filenames:
  - County-level: `County_Name_extremeheat_2025.pdf` and `County_Name_airpollution_2025.pdf`
    - Replace spaces with underscores. Example: `Los Angeles` => `Los_Angeles_extremeheat_2025.pdf`
  - State-level: `california_state_extremeheat_2025.pdf` and `california_state_airpollution_2025.pdf`
- How to update:
  1. Export or save the PDF file with the correct filename.
  2. Upload/overwrite the file in the appropriate folder under `public/factsheets/`.
  3. Commit and push the change, or pass the file to a developer to deploy.

## Images & Logo
- Where they live: `public/images/`.
- Recommended sizes:
  - Header logo: up to 400px wide.
  - Favicon (SVG recommended): `ucla_lppi_dashboard_logo.svg`.
- How to update:
  1. Save the image with the same filename to replace it or use a new name and update `src/app/head.js` (developer help may be required).

## CSV (list of counties with factsheets)
- Team maintains a Google Sheets spreadsheet that is published to CSV and consumed by the app.
- If you need to add a county to the list:
  1. Open the Google Sheet used by the project.
  2. Add the county name (exact match of county name used in the map GeoJSON) to the `county` column.
  3. Save. The app reads the published CSV; changes should appear after a refresh.

## GeoJSON map data
- Only update if county boundaries change or you need a simplified topology.
- File: `public/data/ca_counties.geojson`.
- Contact a developer for changes.

When to contact a developer
- Adding new UI elements, changing the order of items, or changing linking logic.
- If files don’t appear after updates or if the map fails to load.

### Developer notes (short)
- County name matching is case-insensitive and trims whitespace before comparison.
- Files follow the naming conventions listed above.
- Tooltip logic is handled in `src/app/components/CaliforniaMap.js` (React + d3).

## Contact
- Provide the developer with the updated PDFs and preferred filenames for deployment.
