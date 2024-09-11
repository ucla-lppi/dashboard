# Setting Up and Deploying a Localized Dashboard with Next.js

## Step-by-Step Guide

### 1. Set Up Next.js

1. **Install Next.js and create a new project:**
    ```sh
    npx create-next-app my-dashboard
    cd my-dashboard
    yarn add maplibre-gl d3 axios
    ```

2. **Configure Next.js for internationalization:**
    - Edit `next.config.js` to include i18n configuration:
    ```javascript
    module.exports = {
      i18n: {
        locales: ['en', 'es'], // Add your supported locales here
        defaultLocale: 'en',
      },
    };
    ```

### 2. Prepare Your Data

1. **Create a `public/data` directory and add your JSON files:**
    - `public/data/dashboardData.json`
    ```json
    [
      { "id": 1, "value": 10 },
      { "id": 2, "value": 20 },
      { "id": 3, "value": 30 }
    ]
    ```


### 3. Create the Dashboard

1. **Create a dashboard page (`pages/index.js`):**
    ```jsx
    import { useRouter } from 'next/router';
    import { useEffect, useState } from 'react';
    import maplibregl from 'maplibre-gl';
    import * as d3 from 'd3';
    import 'path/to/map-style.css'; // Add the path to your CSS file

    export default function Dashboard() {
      const { locale } = useRouter();
      const [data, setData] = useState([]);

      useEffect(() => {
        // Fetch localized data
        fetch(`/data/dashboardData-${locale}.json`)
          .then(response => response.json())
          .then(data => {
            setData(data);
            createCharts(data);
          })
          .catch(error => console.error('Error fetching data:', error));

        // Initialize MapLibre GL map
        const map = new maplibregl.Map({
          container: 'map',
          style: 'https://demotiles.maplibre.org/style.json',
          center: [-98.5795, 39.8283], // Center of the USA
          zoom: 4
        });

        function createCharts(data) {
          const svg = d3.select('#charts').append('svg')
            .attr('width', 400)
            .attr('height', 400);

          svg.selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('cx', (d, i) => i * 50 + 25)
            .attr('cy', 200)
            .attr('r', d => d.value);
        }
      }, [locale]);

      return (
        <div>
          <div id="map" style={{ width: '100%', height: '50vh' }}></div>
          <div id="charts" style={{ width: '100%', height: '50vh', display: 'flex', justify-content: 'space-around' }}></div>
        </div>
      );
    }
    ```

2. **Create a CSS file (`styles/globals.css`):**
    ```css
    body {
      margin: 0;
      font-family: Arial, sans-serif;
    }

    #map {
      width: 100%;
      height: 50vh;
    }

    #charts {
      width: 100%;
      height: 50vh;
      display: flex;
      justify-content: space-around;
    }
    ```

### 4. Add Additional Functionalities

1. **Smooth Scroll:**
    - Install the `react-scroll` package:
    ```sh
    yarn add react-scroll
    ```
    - Update your dashboard page to include smooth scrolling:
    ```jsx
    import { Link, animateScroll as scroll } from 'react-scroll';

    export default function Dashboard() {
      // ... existing code ...

      return (
        <div>
          <nav>
            <Link to="map" smooth={true} duration={800}>Map</Link>
            <Link to="charts" smooth={true} duration={800}>Charts</Link>
          </nav>
          <div id="map" style={{ width: '100%', height: '50vh' }}></div>
          <div id="charts" style={{ width: '100%', height: '50vh', display: 'flex', justify-content: 'space-around' }}></div>
        </div>
      );
    }
    ```

2. **Sticky Menu:**
    - Install the `react-sticky` package:
    ```sh
    yarn add react-sticky
    ```
    - Update your dashboard page to include a sticky menu:
    ```jsx
    import { StickyContainer, Sticky } from 'react-sticky';

    export default function Dashboard() {
      // ... existing code ...

      return (
        <StickyContainer>
          <Sticky>
            {({ style }) => (
              <nav style={style}>
                <Link to="map" smooth={true} duration={800}>Map</Link>
                <Link to="charts" smooth={true} duration={800}>Charts</Link>
              </nav>
            )}
          </Sticky>
          <div id="map" style={{ width: '100%', height: '50vh' }}></div>
          <div id="charts" style={{ width: '100%', height: '50vh', display: 'flex', justify-content: 'space-around' }}></div>
        </StickyContainer>
      );
    }
    ```

### 5. Deploy to GitHub Pages

1. **Build the site:**
    ```sh
    yarn build
    yarn export
    ```

2. **Push to GitHub:**
    - Create a GitHub repository.
    - Push the contents of the `out` directory to the `gh-pages` branch of your repository.
    ```sh
    git init
    git remote add origin https://github.com/yourusername/your-repo.git
    git checkout -b gh-pages
    git add .
    git commit -m "Deploy to GitHub Pages"
    git push -u origin gh-pages
    ```

### 6. Deploy to AWS

1. **Upload to S3:**
    - Go to the S3 console, create a bucket, and upload the contents of the `out` directory.
    - Set the bucket policy to make the files publicly accessible.

2. **Set Up CloudFront:**
    - Create a CloudFront distribution and point it to your S3 bucket.
    - Configure SSL using AWS Certificate Manager.

### Automating the Deployment

1. **Create a GitHub Actions Workflow:**
    - Create a `.github/workflows/deploy.yml` file in your repository:
    ```yaml
    name: Deploy to AWS

    on:
      push:
        branches:
          - gh-pages

    jobs:
      deploy:
        runs-on: ubuntu-latest

        steps:
          - name: Checkout code
            uses: actions/checkout@v2

          - name: Configure AWS credentials
            uses: aws-actions/configure-aws-credentials@v1
            with:
              aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
              aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
              aws-region: us-east-1

          - name: Sync S3 bucket
            run: |
              aws s3 sync . s3://your-s3-bucket-name --delete

          - name: Invalidate CloudFront cache
            run: |
              aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
    ```

2. **Add your AWS credentials to the GitHub repository secrets.**

This workflow will automatically deploy your site to AWS whenever you push to the `gh-pages` branch.