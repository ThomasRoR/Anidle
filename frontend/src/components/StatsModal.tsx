import React, { useState, useEffect } from 'react';
import type { StatsState, Guess } from '../types';
import { getTranslation } from '../translations';

interface StatsModalProps {
  stats: StatsState;
  guesses: Guess[];
  isGameWon: boolean;
  onClose: () => void;
  language: string;
}

const getNextMidnight = () => {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() - 3);
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow;
};

export const StatsModal: React.FC<StatsModalProps> = ({ stats, guesses, isGameWon, onClose, language }) => {
  const [timeToNext, setTimeToNext] = useState('');
  const [shareText, setShareText] = useState(getTranslation(language, 'stats.shareButton'));

  useEffect(() => {
    setShareText(getTranslation(language, 'stats.shareButton'));
  }, [language]);

  useEffect(() => {
    const timer = setInterval(() => {
      const midnight = getNextMidnight();
      const now = new Date();
      now.setUTCHours(now.getUTCHours() - 3);
      const diff = midnight.getTime() - now.getTime();
      
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeToNext(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const winPercentage = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) : 0;
  const hasCurrentGame = guesses.length > 0;

  const handleShare = () => {
    if (!hasCurrentGame) {
      const shareString = `Anidle - ${getTranslation(language, 'stats.title')}\n${getTranslation(language, 'stats.games')}: ${stats.gamesPlayed}\n${getTranslation(language, 'stats.winRate')}: ${winPercentage}%\n${getTranslation(language, 'stats.currentStreak')}: ${stats.currentStreak}\n${getTranslation(language, 'stats.bestStreak')}: ${stats.maxStreak}`;
      navigator.clipboard.writeText(shareString);
      setShareText(getTranslation(language, 'stats.copied'));
      setTimeout(() => setShareText(getTranslation(language, 'stats.shareButton')), 2000);
      return;
    }

    let shareString = `Anidle #${new Date().getDate()} ${isGameWon ? guesses.length : 'X'}/6\n\n`;
    guesses.forEach(guess => {
      const feedbackLine = [
        guess.feedbackOn.title,
        guess.feedbackOn.studio,
        guess.feedbackOn.year,
        guess.feedbackOn.genres,
      ].map(f => {
        if (f === 'correto') return '🟩';
        if (f === 'parcial') return '🟧';
        return '🟥';
      }).join('');
      shareString += feedbackLine + '\n';
    });

    navigator.clipboard.writeText(shareString);
    setShareText(getTranslation(language, 'stats.copied'));
    setTimeout(() => setShareText(getTranslation(language, 'stats.shareButton')), 2000);
  };
  
  const maxDistribution = Math.max(...Object.values(stats.guessDistribution), 1);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        
        {hasCurrentGame ? (
          <h2>{isGameWon ? getTranslation(language, 'gameMessages.win') : getTranslation(language, 'stats.loseMessage')}</h2>
        ) : (
          <h2>{getTranslation(language, 'stats.title')}</h2>
        )}
        
        <div className="stats-summary">
          <div><strong>{stats.gamesPlayed}</strong><p>{getTranslation(language, 'stats.games')}</p></div>
          <div><strong>{winPercentage}%</strong><p>{getTranslation(language, 'stats.winRate')}</p></div>
          <div><strong>{stats.currentStreak}</strong><p>{getTranslation(language, 'stats.currentStreak')}</p></div>
          <div><strong>{stats.maxStreak}</strong><p>{getTranslation(language, 'stats.bestStreak')}</p></div>
        </div>
        
        <h3>{getTranslation(language, 'stats.distributionTitle')}</h3>
        <div className="distribution-chart">
          {Object.entries(stats.guessDistribution).map(([attempt, count]) => (
            <div className="chart-row" key={attempt}>
            <div className="attempt-number">{attempt}</div>
            <div className="bar-container">
                <div 
                className={`bar ${count > 0 ? 'has-count' : ''} ${hasCurrentGame && isGameWon && guesses.length === parseInt(attempt) ? 'is-winner' : ''}`}
                style={{ width: `${(count / maxDistribution) * 100}%` }}
                >
                </div>
            </div>
            <div className="bar-count">{count}</div>
        </div>
          ))}
        </div>
        
        <div className="footer">
          <div className="countdown">
            <p>{getTranslation(language, 'stats.nextAnidle')}</p>
            <strong>{timeToNext}</strong>
          </div>
          <button className="share-button" onClick={handleShare}>{shareText}</button>
        </div>
      </div>
    </div>
  );
};