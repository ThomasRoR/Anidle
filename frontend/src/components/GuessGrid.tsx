// src/components/GuessGrid.tsx
import React from 'react';
import type { Guess } from '../types';
import { GuessRow } from './GuessRow';

interface GuessGridProps {
  guesses: Guess[];
}

export const GuessGrid: React.FC<GuessGridProps> = ({ guesses }) => {
  return (
    <div className="guess-grid">
      {guesses.length > 0 && (
          <div className="grid-header">
              <div>Capa</div>
              <div>Nome</div>
              <div>Estúdio</div>
              <div>Ano</div>
              <div>Gêneros</div>
          </div>
      )}
      {guesses.map((guess, index) => (
        <GuessRow key={index} guess={guess} />
      ))}
    </div>
  );
};