import { useState, useEffect } from 'react';

export const useLanguage = () => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // Carregar idioma salvo do localStorage
    const savedLanguage = localStorage.getItem('anidle_language');
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'pt')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (newLanguage: 'en' | 'pt') => {
    setLanguage(newLanguage);
    localStorage.setItem('anidle_language', newLanguage);
  };

  return { language, changeLanguage };
};
