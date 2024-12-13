// src/app/components/HorizontalScrollWithCSV.js
import React, { useEffect, useState, useRef } from 'react';
import Papa from 'papaparse';
import styles from './HorizontalScroll.module.css';

const HorizontalScrollWithCSV = ({ csvUrl, type }) => {
  const [items, setItems] = useState([]);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(csvUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          complete: (results) => {
            const filteredItems = results.data.filter(item => item.Type === type);
            setItems(filteredItems);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      } catch (error) {
        console.error('Error fetching CSV:', error);
      }
    };

    fetchData();
  }, [csvUrl, type]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
      if (scrollLeft === 0) {
        scrollContainerRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: -clientWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainerRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <button className={`${styles.scrollButton} ${styles.left}`} onClick={scrollLeft}>{"<"}</button>
      <div className={styles.scrollContainer} ref={scrollContainerRef}>
        {items.length === 0 && <p>No items found for type: {type}</p>}
        {items.map((item, index) => (
          <div key={index} className={styles.scrollItem}>
            <img src={item.File} alt={item.Title} />
            <h3>{item.Title}</h3>
            <p>{item['Post date']}</p>
          </div>
        ))}
      </div>
      <button className={`${styles.scrollButton} ${styles.right}`} onClick={scrollRight}>{">"}</button>
    </div>
  );
};

export default HorizontalScrollWithCSV;