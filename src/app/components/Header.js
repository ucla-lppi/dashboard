// src/app/components/Header.js
import React from 'react';
import Link from 'next/link';
import styles from '../styles/Header.module.css'; // Import the CSS module
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

const Header = ({ darkMode, setDarkMode }) => {
  return (
    <header className={`${styles.header} p-4 bg-gray-800 text-white`}>
      <nav className="flex justify-between items-center">
        <ul className="flex space-x-4">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/impact">Impact</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/resources">Resources</Link></li>
        </ul>
        <button onClick={() => setDarkMode(!darkMode)} className="text-white">
          <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
      </nav>
    </header>
  );
};

export default Header;