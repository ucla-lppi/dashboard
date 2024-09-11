// context/LocaleContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const LocaleContext = createContext();

export const LocaleProvider = ({ children }) => {
  const router = useRouter();
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    if (router.query.locale) {
      setLocale(router.query.locale);
    }
  }, [router.query.locale]);

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'es' : 'en';
    router.push({
      pathname: router.pathname,
      query: { ...router.query, locale: newLocale },
    });
  };

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);