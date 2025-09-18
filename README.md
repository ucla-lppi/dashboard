# LPPI Dashboard

This repository contains the UCLA LPPI Latino Climate & Health Dashboard — a public-facing website that hosts state and county factsheets and an interactive California map.

## For content editors (non-technical)

Short version: to update factsheets or images you only need to replace files in the `public/` folder and ask a developer to deploy, or follow the simple steps in `MAINTENANCE.md`.

What you can edit without writing code
- Factsheets (PDFs): `public/factsheets/extremeheat/` and `public/factsheets/airpollution/`
  - County files must use the pattern `County_Name_extremeheat_2025.pdf` and `County_Name_airpollution_2025.pdf` (replace spaces with underscores). Example: `Los_Angeles_extremeheat_2025.pdf`.
  - State files are expected as `california_state_extremeheat_2025.pdf` and `california_state_airpollution_2025.pdf`.
- Images and logos: `public/images/` (including `ucla_lppi_dashboard_logo.svg` used as the main logo/favicon).
- CSV list of counties with factsheets: maintained in a Google Sheet and published to CSV. Editing the sheet’s `county` column will add/remove counties shown on the map.

How to update (non-technical step-by-step)
1. Prepare the PDF or image with the correct filename (see patterns above).
2. Upload or overwrite the file in the matching folder under `public/` (your deployment process may vary; you can hand the file to a developer if you do not use git).
3. After the file is deployed, refresh the site. County additions from the published CSV may require a page refresh or a short delay.

If you’re unsure, follow `MAINTENANCE.md` for exact steps and screenshots (simple checklist included).

## For developers

This section describes how to run, build, and inspect the app.

Quick developer start

1. Install dependencies:

```bash
yarn install
```

2. Start dev server with hot reload:

```bash
yarn dev
```

3. Open http://localhost:3000 in your browser.

Build & export

The project uses `next export` to generate a static `out/` directory suitable for simple static hosting (e.g., GitHub Pages):

```bash
yarn build
yarn export
```

Project structure (relevant parts)

```
/project-root
  ├── src/app                # Next.js app dir (components, pages, layout)
  ├── public                # Static assets: images, factsheets, data geojson
  │   ├── factsheets/
  │   ├── images/
  │   └── data/
  ├── src/utils             # helper scripts (small python/js helpers)
  ├── next.config.mjs
  ├── package.json
  └── MAINTENANCE.md        # Non-technical maintenance checklist
```

Key developer commands

- `yarn dev` — run development server with HMR
- `yarn build` — build for production
- `yarn export` — export a static site into `out/` (used for gh-pages deploy)

Important implementation notes

- Factsheets are served from `public/factsheets/<topic>/`.
- The map reads county availability from a published CSV (Google Sheets) and matches by county name; matching is case-insensitive and whitespace-normalized.
- The interactive map component is `src/app/components/CaliforniaMap.js`.

Dependencies

Primary libraries used by the app include Next.js, React, Tailwind CSS, D3.js, and PapaParse for CSV parsing. See `package.json` for exact versions.

If you need a hand updating the deployment or making structural changes, open an issue or contact the repository maintainers.

