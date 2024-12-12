# Project Title

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, install the dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Project Structure

This project includes the following directories and files:

```plaintext
/project-root
  ├── /app
  │   ├── /components
  │   │   └── FancyBoxes.js
  │   ├── /pages
  │   │   └── index.js
  │   └── page.js
  ├── /public
  │   └── /images
  │       └── lppi-bg.svg
  ├── /styles
  │   └── globals.css
  ├── /data
  │   └── ca_counties_simplified.geojson
  ├── /content
  │   └── example.md
  ├── .gitignore
  ├── package.json
  ├── README.md
  └── yarn.lock
  ```

- `/app` - Contains the Next.js application.
- `/app/components` - Contains React components used in the application.
- `/app/pages` - Contains the Next.js pages.
- `/public` - Contains static files like images and JSON data.
- `/styles` - Contains global styles.
- `/data` - Contains data files like GeoJSON.
- `/content` - Contains markdown files for content.
- `.gitignore` - Specifies intentionally untracked files to ignore.
- `package.json` - Contains project metadata and dependencies.
- `README.md` - Contains project documentation.
- `yarn.lock` - Contains exact versions of dependencies for reproducible builds.

## Technology Stack

- [Next.js](https://nextjs.org/) - A React framework with hybrid static & server rendering, and more.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for quickly building custom designs.
- [MapLibre GL](https://maplibre.org/) - A free, open-source mapping library that's compatible with Mapbox GL JS.
- [D3.js](https://d3js.org/) - A JavaScript library for producing dynamic, interactive data visualizations in web browsers.
- [Axios](https://axios-http.com/) - A promise-based HTTP client for the browser and Node.js.
- [Internationalization](https://nextjs.org/docs/advanced-features/i18n-routing) - Built-in support for internationalized routing in Next.js.

