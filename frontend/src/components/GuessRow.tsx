import React from 'react';
import type { Guess } from '../types';

interface GuessRowProps {
  guess: Guess;
}

export const GuessRow: React.FC<GuessRowProps> = ({ guess }) => {
  const { guessedAnimeData, feedbackOn } = guess;

  return (
    <div className="guess-row">
      <div className="cell">
        <img src={guessedAnimeData.main_picture.medium} alt={guessedAnimeData.title} />
      </div>
      <div className={`cell feedback-${feedbackOn.title}`}>
        {guessedAnimeData.title}
      </div>
      <div className={`cell feedback-${feedbackOn.studio}`}>
        {guessedAnimeData.studios[0]?.name || 'N/A'}
      </div>
      <div className={`cell feedback-${feedbackOn.year}`}>
        {new Date(guessedAnimeData.start_date).getFullYear() || 'N/A'}
      </div>
      <div className={`cell feedback-${feedbackOn.genres}`}>
        {guessedAnimeData.genres.slice(0, 3).map((g: any) => g.name).join(', ')}
      </div>
    </div>
  );
};