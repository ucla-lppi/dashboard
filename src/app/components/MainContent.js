"use client";
import React from 'react';
import styles from './MainContent.module.css';
import MapComponent from './MapComponent';  // Changed from named import to default import

export default function MainContent() {
  return (
    <div className={`${styles.container} bg-[#fcfcfc] rounded-[10px] shadow-[6px_6px_0px_#ae8e3b]`}>
      {/* Test content can go here */}
      <h1 className="text-center text-2xl font-bold mt-4">The Latino Climate and Health Dashboard provides an evidence base to foster policy change that enhances economic opportunity, health, and environmental justice outcomes for Latinos in California. </h1>
      <p className="text-center mt-2"></p>
		<div id="map" className="relative z-0">
			<MapComponent />
		</div>
    </div>
  );
}
