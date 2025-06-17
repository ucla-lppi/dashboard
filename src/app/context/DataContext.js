"use client";
import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext({
  dataMap: {},
  setDataForUrl: () => {},
  getDataForUrl: () => null,
});

export function DataProvider({ children }) {
  const [dataMap, setDataMap] = useState({});
  const setDataForUrl = (url, data) => setDataMap(prev => ({ ...prev, [url]: data }));
  const getDataForUrl = url => dataMap[url] || null;

  return (
    <DataContext.Provider value={{ dataMap, setDataForUrl, getDataForUrl }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useDataContext must be used within DataProvider');
  return context;
}