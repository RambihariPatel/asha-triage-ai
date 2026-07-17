import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export const LanguageProvider = ({ children }) => {
  // Load saved language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('asha_app_language') || 'en';
  });

  // Whenever language changes, save to localStorage
  useEffect(() => {
    localStorage.setItem('asha_app_language', language);
  }, [language]);

  // Translation helper function
  const t = (key, translationsObject) => {
    if (!translationsObject) return key;
    return translationsObject[language] || translationsObject['en'] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
