import React from 'react';
import { getTranslation } from '../translations';

interface LanguageSwitchProps {
  currentLanguage: string;
  onLanguageChange: (language: 'en' | 'pt') => void;
}

export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ 
  currentLanguage, 
  onLanguageChange 
}) => {
  return (
    <div className="language-switch">
      <button
        className={`lang-button ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => onLanguageChange('en')}
        title={getTranslation(currentLanguage, 'languageSwitch.en')}
      >
        EN
      </button>
      <button
        className={`lang-button ${currentLanguage === 'pt' ? 'active' : ''}`}
        onClick={() => onLanguageChange('pt')}
        title={getTranslation(currentLanguage, 'languageSwitch.pt')}
      >
        PT
      </button>
    </div>
  );
};
