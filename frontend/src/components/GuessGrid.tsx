import React from 'react';
import type { Guess } from '../types';
import { GuessRow } from './GuessRow';
import { getTranslation } from '../translations';

interface GuessGridProps {
  guesses: Guess[];
  language: string;
}

export const GuessGrid: React.FC<GuessGridProps> = ({ guesses, language }) => {
  return (
    <div className="guess-grid">
      {guesses.length > 0 && (
          <div className="grid-header">
              <div>{getTranslation(language, 'grid.cover')}</div>
              <div>{getTranslation(language, 'grid.name')}</div>
              <div>{getTranslation(language, 'grid.studio')}</div>
              <div>{getTranslation(language, 'grid.year')}</div>
              <div>{getTranslation(language, 'grid.genres')}</div>
          </div>
      )}
      {guesses.map((guess, index) => (
        <GuessRow key={index} guess={guess} />
      ))}
    </div>
  );
};