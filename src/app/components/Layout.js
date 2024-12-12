// src/app/components/Layout.js
import React from 'react';
import Header from './Header';

const Layout = ({ children, darkMode, setDarkMode }) => (
  <div className="min-h-screen flex flex-col">
    <Header darkMode={darkMode} setDarkMode={setDarkMode} />
    <main className="flex-grow p-4 md:p-8 lg:p-12">
      {children}
    </main>
    <footer className="p-4 bg-gray-800 text-white text-center">
      <p>My Site Footer</p>
    </footer>
  </div>
);

export default Layout;