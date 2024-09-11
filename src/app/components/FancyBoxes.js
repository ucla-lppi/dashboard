import React, { useEffect, useRef } from 'react';
import { getAssetUrl } from '../utils'; // Adjust the path as necessary

export default function FancyBoxes({ data }) {
  const containerRef = useRef(null);

  // Define the top-level categories
  const categories = ['Demographics', 'Extreme Heat', 'Exposure to Pollution Burden'];

  // Extract summary statistics for the top-level categories
  const getSummaryStatistics = (category) => {
    const filteredData = data.filter(d => d.type === category);
    return filteredData.map(d => ({
      year: parseInt(d.year, 10), // Ensure year is an integer
      value: parseFloat(d.count), // Convert to numerical type
    }));
  };

  const summaryStatistics = categories.map(category => {
    const values = getSummaryStatistics(category);
    const years = [...new Set(values.map(v => v.year))].sort((a, b) => b - a);
    const latestYear = years[0];
    const previousYear = years[1];
    const latestValue = values.find(v => v.year === latestYear)?.value || 0;
    const previousValue = values.find(v => v.year === previousYear)?.value || 0;
    const percentageChange = previousValue !== 0 ? ((latestValue - previousValue) / previousValue) * 100 : 0;
    const isIncrease = latestValue > previousValue;

    return {
      label: category,
      latestValue,
      previousValue,
      percentageChange: percentageChange.toFixed(2),
      isIncrease,
      latestYear,
      previousYear,
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
              ticker.innerText = countTo % 1 === 0 ? countTo.toLocaleString() : countTo.toFixed(2);
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

  const backgroundImageUrl = getAssetUrl('/images/lppi-bg.svg');

  return (
    <div ref={containerRef} className="degree-prod relative bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
      <div className="absolute inset-0 bg-primary opacity-95 dark:opacity-95"></div> {/* Overlay */}
      <div className="container mx-auto py-4 relative z-10">
        <h2 className="headline headline--medium t-center">California Latino <strong>Wellness Summary Statistics</strong></h2>
      </div>
      <div className="flex justify-around container mx-auto py-8 relative z-10">
        {summaryStatistics.map((item, index) => (
          <div key={index} className="box flex-1 p-4 m-2 border border-gray-300 bg-white shadow-lg text-center">
            <div className="desc no-margin" style={{ fontSize: '1.5rem' }}>{item.label}</div>
            <div className="num" style={{ fontSize: '3rem' }}>
              <strong>
                <span className="ticker c-blue--darker" data-count={item.latestValue}>{item.latestValue}</span>
              </strong>
            </div>
            <div className="headline--small no-margin-bottom" style={{ color: '#0988c9', fontSize: '1.5rem' }}>
              <strong>
                <span className="ticker" data-count={item.percentageChange} data-increase={item.isIncrease}>{item.percentageChange}</span>%
                <span className="triangle" style={{ display: 'none' }}>{item.isIncrease ? ' ▲' : ' ▼'}</span>
              </strong>
            </div>
            <div className="desc c-blue no-padding" style={{ color: '#0988c9', fontSize: '1rem' }}>{item.latestYear} vs. {item.previousYear}</div>
          </div>
        ))}
      </div>
    </div>
  );
}