'use client';

import { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { Link as ScrollLink } from 'react-scroll'; // Renamed to avoid confusion

import Header from './Header';

import FancyBoxes from './FancyBoxesPlaceholder';
import MapComponent from './MapComponent';
import { getAssetUrl } from '../utils'; // Adjust the path as necessary
import '../styles/globals.css'; // Adjust the path to your CSS file
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

export default function Dashboard() {
    const [data, setData] = useState([]);
    const [darkMode, setDarkMode] = useState(false);
  
    useEffect(() => {
      // Fetch data
      const csvPath = getAssetUrl('/data/summaryData.csv');
  
      csv(csvPath)
        .then(data => {
          // Ensure count values are parsed as numbers
          const parsedData = data.map(d => ({
            ...d,
            count: parseFloat(d.count),
            year: parseInt(d.year, 10),
          }));
          setData(parsedData);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    useEffect(() => {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, [darkMode]);
  
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
        <div id="overview" className="relative z-10">
          <FancyBoxes data={data} darkMode={darkMode} />
        </div>
        {/* Footer Section */}
        <footer className="p-4 bg-white-800 text-center">
          <a
            href="https://latino.ucla.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transform hover:scale-105 transition-transform duration-200"
          >
            <img
              src="./images/Bxd_Blk_LatinoPolicy_Luskin_A.png"
              alt="Latino Policy Logo"
              className="h-12 w-auto mx-auto"
            />
          </a>
        </footer>
      </div>
    );
}
// export default function RealDashboard() {
//   const [data, setData] = useState([]);
//   const [darkMode, setDarkMode] = useState(false);

//   useEffect(() => {
//     // Fetch data
//     const csvPath = getAssetUrl('/data/summaryData.csv');

//     csv(csvPath)
//       .then(data => {
//         // Ensure count values are parsed as numbers
//         const parsedData = data.map(d => ({
//           ...d,
//           count: parseFloat(d.count),
//           year: parseInt(d.year, 10),
//         }));
//         setData(parsedData);
//       })
//       .catch(error => console.error('Error fetching data:', error));
//   }, []);

//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [darkMode]);

//   return (
//     <div className={darkMode ? 'dark' : ''}>
//       <Header darkMode={darkMode} setDarkMode={setDarkMode} />
//       <nav className="sticky top-0 z-50 flex justify-around bg-gray-800 text-white p-4">
//         <Link to="overview" smooth={true} duration={800} className="cursor-pointer">Overview</Link>
//         <Link to="map" smooth={true} duration={800} className="cursor-pointer">Map</Link>
//         <Link to="charts" smooth={true} duration={800} className="cursor-pointer">Charts</Link>
//       </nav>
//       <div id="overview" className="relative z-10">
//         <FancyBoxes data={data} darkMode={darkMode} />
//       </div>
//       <div id="map" className="relative z-0">
//         <MapComponent />
//       </div>
//       <div id="charts" className="w-full h-1/2 flex justify-around"></div>
//     </div>
//   );
// }