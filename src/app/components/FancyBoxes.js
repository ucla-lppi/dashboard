import React, { useEffect, useRef, useState } from 'react';
import { getAssetUrl } from '../utils'; // Adjust the path as necessary
import Papa from 'papaparse';

// Configuration flag to switch between Google Sheets and local CSV
const USE_GOOGLE_SHEETS = true; // Set to true to use Google Sheets

function FancyBoxItem({ item }) {
  const [displayNumber, setDisplayNumber] = useState(item.number_comparison);
  useEffect(() => {
    // Extract number and suffix (e.g., '2x' => 2, 'x')
    const match = String(item.number_comparison).match(/^([\d,.]+)(.*)$/);
    if (!match) {
      setDisplayNumber(item.number_comparison);
      return;
    }
    const num = parseFloat(match[1].replace(/,/g, ''));
    const suffix = match[2] || '';
    if (isNaN(num)) {
      setDisplayNumber(item.number_comparison);
      return;
    }
    const duration = 1200;
    const startTime = performance.now();
    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const val = num * progress;
      setDisplayNumber((num % 1 === 0 ? Math.round(val) : val.toFixed(2)) + suffix);
      if (progress < 1) requestAnimationFrame(animate);
      else setDisplayNumber(item.number_comparison);
    }
    requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [item.number_comparison]);

  // Helper to render detail with underlined segments using *...* for underline
  function renderDetail(detail) {
    const parts = [];
    let lastIdx = 0;
    let match;
    const regex = /\*(.*?)\*/g;
    let idx = 0;
    while ((match = regex.exec(detail)) !== null) {
      if (match.index > lastIdx) {
        parts.push(<span key={idx++}>{detail.slice(lastIdx, match.index)}</span>);
      }
      parts.push(<span key={idx++} className="font-bold underline">{match[1]}</span>);
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < detail.length) {
      parts.push(<span key={idx++}>{detail.slice(lastIdx)}</span>);
    }
    return parts;
  }

  return (
    <div className="flex flex-row items-stretch w-full max-w-2xl">
      {/* Left: Gradient box */}
      <div className="flex flex-col items-center justify-center rounded-l-[10px] border-2 border-[#aec8c3] bg-gradient-to-b from-primary to-accents min-w-[120px] max-w-[180px] w-2/5 py-4 px-2 relative">
        {/* White circle with number */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-[68px] h-[68px] bg-[#f2f2f2] rounded-full shadow-[0px_4px_4px_#00000040] mb-2">
            <span className="font-bold text-primary text-3xl text-center font-Lexend_Deca">{displayNumber}</span>
          </div>
          {/* Label below */}
          <div className="w-full">
            <div className="font-semibold text-white text-base text-center leading-tight font-Lexend_Deca">
              {item.label1 || item.label}
              {item.label2 && <><br />{item.label2}</>}
            </div>
          </div>
        </div>
      </div>
      {/* Gap */}
      <div style={{ width: 5, minWidth: 5, background: 'white' }} />
      {/* Right: White box with border */}
      <div className="flex-1 bg-[#fcfcfc] rounded-r-[10px] border-2 border-[#aec8c3] flex items-center px-6 py-4">
        <div className="w-full text-[#002e45] text-base text-center font-Lexend_Deca">
          {renderDetail(item.detail)}
        </div>
      </div>
    </div>
  );
}

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
        const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vQj-jsVttYyQfv02E_FWiPvoNXz1Yeq7lVCKJymnxkEz9cyF5Mak9T8NFaL__5J_EsxTOgZaEcsa7Qw/pub?gid=360206538&single=true&output=csv');
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

  // Skeleton loader for Fancy Boxes
  const FancyBoxSkeleton = () => (
    <div className="flex flex-row items-stretch w-full max-w-2xl animate-pulse">
      {/* Left: Gradient box skeleton */}
      <div className="flex flex-col items-center justify-center rounded-l-[10px] border-2 border-[#aec8c3] bg-gradient-to-b from-primary to-accents min-w-[120px] max-w-[180px] w-2/5 py-4 px-2 relative">
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-[68px] h-[68px] bg-[#e5e7eb] rounded-full mb-2" />
          <div className="w-full h-4 bg-[#e5e7eb] rounded mt-2" />
          <div className="w-2/3 h-3 bg-[#e5e7eb] rounded mt-1" />
        </div>
      </div>
      {/* Gap */}
      <div style={{ width: 5, minWidth: 5, background: 'white' }} />
      {/* Right: White box skeleton */}
      <div className="flex-1 bg-[#fcfcfc] rounded-r-[10px] border-2 border-[#aec8c3] flex items-center px-6 py-4">
        <div className="w-full">
          <div className="h-4 bg-[#e5e7eb] rounded w-3/4 mx-auto mb-2" />
          <div className="h-3 bg-[#e5e7eb] rounded w-1/2 mx-auto" />
        </div>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="container mx-auto py-8">
      <div className="flex flex-col items-center space-y-6">
        {!isDataLoaded
          ? Array.from({ length: 3 }).map((_, i) => <FancyBoxSkeleton key={i} />)
          : data.map((item, index) => (
              <FancyBoxItem key={index} item={item} />
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