import React, { useEffect, useRef, useState } from 'react';
import { getAssetUrl } from '../utils'; // Adjust the path as necessary
import Papa from 'papaparse';

// Configuration flag to switch between Google Sheets and local CSV
const USE_GOOGLE_SHEETS = true; // Set to true to use Google Sheets

export default function FancyBoxes({ onLoaded }) {
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
          if (onLoaded) {
            onLoaded(); // Notify parent that FancyBoxes has finished loading
          }
        },
      });
    };

    fetchData();
  }, [onLoaded]);

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
    <div ref={containerRef} className="container mx-auto py-8">

      <div className="flex flex-col items-center space-y-6">
        {summaryStatistics.map((item, index) => (
          <div
            key={index}
            className={`card p-6 shadow-[6px_6px_0px_var(--quaternary-color)] border border-primary rounded-lg bg-white w-full max-w-md ${themeClass === 'dark-mode' ? 'dark:bg-gray-800 dark:border-primary' : ''}`}
          >
            {isDataLoaded ? (
              <>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  {getHeaderText(item.headerIntro, item.headerIndicator)}
                </h3>
                <h2 className="text-3xl font-bold text-primary mb-2 text-center">
                  <span className="ticker" data-count={item.latinoValue}>
                    {item.latinoValue}
                  </span>
                </h2>

              </>
            ) : (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// old code for descripency and triangle
{/* <h4 className="text-lg font-medium text-gray-600 mb-2 text-center">
<strong>
  <span>{item.formattedDiscrepancyPercentage}%</span>
  <span className="triangle ml-2">
	{item.discrepancy >= 0 ? '▲' : '▼'}
  </span>
</strong>
</h4>
<h6 className="text-sm text-gray-500 text-center">
(Latino {item.latinoValue.toLocaleString()} vs White {item.whiteValue.toLocaleString()})
</h6> */}