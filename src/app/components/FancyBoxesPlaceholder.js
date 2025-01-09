import React, { useEffect, useRef, useState } from 'react';
import { getAssetUrl } from '../utils'; // Adjust the path as necessary
import Papa from 'papaparse';

// Configuration flag to switch between Google Sheets and local CSV
const USE_GOOGLE_SHEETS = true; // Set to true to use Google Sheets

export default function FancyBoxes() {
  const containerRef = useRef(null);
  const [data, setData] = useState([]);
  const [themeClass, setThemeClass] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [boxHeights, setBoxHeights] = useState({});

  useEffect(() => {
    // Check for dark mode and set the theme class
    const isDarkMode = document.body.classList.contains('dark-mode');
    setThemeClass(isDarkMode ? 'dark-mode' : '');

    // Fetch and parse CSV data
    const fetchData = async () => {
      let csvText;
      if (USE_GOOGLE_SHEETS) {
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vS_YYdPSeEUznhdpsonMOsvZQ2Lq3R2SuJKSbvDwJ9vwvv5V4RMZEwKISWhWTpy_kokJy-DTWa5cJVF/pub?output=csv');
        csvText = await response.text();
      } else {
        const response = await fetch(getAssetUrl('/data/summaryData.csv')); // Use getAssetUrl to fetch local CSV
        csvText = await response.text();
      }
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          setData(results.data);
          setIsDataLoaded(true); // Set data loaded flag to true
        },
      });
    };

    fetchData();
  }, []);

  // Define the top-level categories and their subcategories
  const categories = {
    'Demographics': ['White', 'Latino'],
    'Extreme Heat': ['High Impact Latino', 'High Impact White'],
    'Exposure to Pollution Burden': ['High Impact Latino', 'High Impact White']
  };

  // Extract summary statistics for the top-level categories and their subcategories
  const getSummaryStatistics = (category, subcategory) => {
    const filteredData = data.filter(d => d.type === category && d.category === subcategory);
    const totalValue = filteredData.reduce((acc, curr) => acc + parseFloat(curr.count), 0);
    return totalValue;
  };

  const summaryStatistics = Object.keys(categories).map(category => {
    const subcategories = categories[category].map(subcategory => {
      const totalValue = getSummaryStatistics(category, subcategory);
      return {
        label: subcategory,
        totalValue,
      };
    });
    const latinoValue = subcategories.find(sub => sub.label.includes('Latino')).totalValue;
    const whiteValue = subcategories.find(sub => sub.label.includes('White')).totalValue;
    const discrepancy = latinoValue - whiteValue;
    const discrepancyPercentage = ((discrepancy / whiteValue) * 100).toFixed(2);
    const formattedDiscrepancyPercentage = discrepancyPercentage.endsWith('.00') ? parseInt(discrepancyPercentage) : discrepancyPercentage;
    const headerIntro = data.find(d => d.type === category)?.headerIntro || '';
    const headerIndicator = data.find(d => d.type === category)?.headerIndicator || '';
    return {
      category,
      subcategories,
      discrepancy,
      formattedDiscrepancyPercentage,
      latinoValue,
      whiteValue,
      headerIntro,
      headerIndicator,
    };
  });

  useEffect(() => {
    const tickers = document.querySelectorAll('.ticker');
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const ticker = entry.target;
          const countTo = parseFloat(ticker.getAttribute('data-count'));
          let count = 0;
          const duration = 2000; // Duration of the animation in milliseconds
          const startTime = performance.now();

          const updateCount = (currentTime) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            count = countTo * progress;
            ticker.innerText = countTo % 1 === 0 ? Math.ceil(count).toLocaleString() : count.toFixed(2);
            if (progress < 1) {
              requestAnimationFrame(updateCount);
            } else {
              ticker.innerText = countTo % 1 === 0 ? countTo.toLocaleString() : count.toFixed(2);
              // Show the triangle after the animation
              const triangle = ticker.nextElementSibling;
              if (triangle) {
                triangle.style.display = 'inline';
              }
            }
          };
          requestAnimationFrame(updateCount);
          observer.unobserve(ticker); // Stop observing once the animation starts
        }
      });
    }, { threshold: 0.1 });

    tickers.forEach(ticker => observer.observe(ticker));

    return () => {
      observer.disconnect();
    };
  }, [data]);

  useEffect(() => {
    if (isDataLoaded) {
      document.querySelectorAll('.ticker, .discrepancy, .comparison').forEach(element => {
        element.classList.add('fade-in');
      });
    }
  }, [isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      const newBoxHeights = {};
      document.querySelectorAll('.box').forEach((box, index) => {
        newBoxHeights[index] = box.offsetHeight;
      });
      setBoxHeights(newBoxHeights);
    }
  }, [isDataLoaded]);

  const backgroundImageUrl = getAssetUrl('/images/lppi-bg.svg');

  const getHeaderText = (headerIntro, headerIndicator) => {
    return (
      <span>
        {headerIntro} <br />
        <strong style={{ fontSize: '1.5rem' }}>{headerIndicator}</strong>
      </span>
    );
  };

  return (
    <div ref={containerRef} className={`fancy-box relative bg-cover bg-center ${themeClass}`} style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
      <div className="absolute inset-0 bg-primary opacity-95 dark:opacity-95"></div> {/* Overlay */}
      <div className="container mx-auto py-4 relative z-10">
        <h2 className="headline headline--medium t-center">Latino Climate Health <strong>Dashboard </strong><br></br>Coming soon.</h2>
      </div>
    </div>
  );
}