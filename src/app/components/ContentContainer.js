import React from 'react';
import styles from './ContentContainer.module.css';

export default function ContentContainer() {
  return (
    <div className={styles.container}>
      <img 
        src="/static/img/bg_circle_top_left.svg" 
        alt="Top left circle" 
        className={styles.topLeftCircle}
      />
      <img 
        src="/static/img/bg_circle_bottom_right.svg" 
        alt="Bottom right circle" 
        className={styles.bottomRightCircle}
      />
      {/* ...existing or additional content... */}
    </div>
  );
}
