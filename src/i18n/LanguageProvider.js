import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getLocalizedCopy, LANGUAGE_STORAGE_KEY } from './copy';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === 'undefined') {
      return 'id';
    }

    return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || 'id';
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    document.documentElement.lang = language === 'ja' ? 'ja' : 'id';
    document.documentElement.dataset.language = language;
  }, [language]);

  const value = useMemo(() => ({
    language,
    setLanguage,
    copy: getLocalizedCopy(language),
    isJapanese: language === 'ja',
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider.');
  }

  return context;
}

