// frontend/src/Game.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GuessInput } from './components/GuessInput';
import { GuessGrid } from './components/GuessGrid';
import { ImageClue } from './components/ImageClue';
import { StatsModal } from './components/StatsModal';
import type { GameState, StatsState, Guess } from './types';

interface DailyChallenge {
  id: number;
  imageUrl: string;
}

const API_BASE_URL = 'http://localhost:3001/api';
const MAX_GUESSES = 6;

const getTodayString = () => {
    const now = new Date();
    now.setUTCHours(now.getUTCHours() - 3);
    return now.toISOString().split('T')[0];
}

export const Game: React.FC = () => {
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [gameState, setGameState] = useState<GameState>({ date: getTodayString(), guesses: [], isGameWon: false, isGameLost: false });
  const [stats, setStats] = useState<StatsState>({ gamesPlayed: 0, wins: 0, currentStreak: 0, maxStreak: 0, guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 } });
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedStats = localStorage.getItem('anidle_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
    
    const savedGame = localStorage.getItem('anidle_game');
    const today = getTodayString();
    if (savedGame) {
      const parsedGame: GameState = JSON.parse(savedGame);
      if (parsedGame.date === today) {
        setGameState(parsedGame);
        if (parsedGame.isGameLost) {
          axios.get(`${API_BASE_URL}/answer`).then(res => setCorrectAnswer(res.data.title));
        }
      } else {
        localStorage.removeItem('anidle_game');
      }
    }
    
    const fetchDailyChallenge = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/daily-challenge`);
        setDailyChallenge(response.data);
      } catch (err) {
        setError('Não foi possível carregar o desafio do dia. O backend está rodando?');
      }
    };
    fetchDailyChallenge();
  }, []);
  
  const handleGuessSubmit = async (guessId: number) => {
    if (gameState.isGameWon || gameState.isGameLost) return;
    const isDuplicate = gameState.guesses.some(g => g.guessedAnimeData.id === guessId);
    if (isDuplicate) {
      setNotification('Você já chutou este anime!');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/check-guess`, { guessId });
      const feedbackResult: Guess = response.data;
      
      const newGuesses = [feedbackResult, ...gameState.guesses];
      const isCorrect = response.data.isCorrect;
      const isGameLost = !isCorrect && newGuesses.length === MAX_GUESSES;
      
      const newGameState: GameState = { ...gameState, guesses: newGuesses, isGameWon: isCorrect, isGameLost };
      setGameState(newGameState);
      localStorage.setItem('anidle_game', JSON.stringify(newGameState));
      
      if (isCorrect || isGameLost) {
        const newStats = { ...stats };
        newStats.gamesPlayed += 1;
        if (isCorrect) {
          newStats.wins += 1;
          newStats.currentStreak += 1;
          newStats.maxStreak = Math.max(newStats.maxStreak, newStats.currentStreak);
          newStats.guessDistribution[newGuesses.length as keyof typeof newStats.guessDistribution] += 1;
        } else {
          newStats.currentStreak = 0;
          axios.get(`${API_BASE_URL}/answer`).then(res => setCorrectAnswer(res.data.title));
        }
        setStats(newStats);
        localStorage.setItem('anidle_stats', JSON.stringify(newStats));
        setTimeout(() => setShowStatsModal(true), 1500);
      }

    } catch (err) {
      setError('Erro ao verificar o chute. Tente novamente.');
    }
  };

  const isGameOver = gameState.isGameWon || gameState.isGameLost;
  const blurLevel = Math.max(0, 16 - gameState.guesses.length * 4);

  if (error) return <div className="game-container error-message">{error}</div>;
  if (!dailyChallenge) return <div className="game-container">Carregando desafio...</div>;

  return (
    <div className={`game-container ${gameState.isGameWon ? 'game-won' : ''}`}>
      {showStatsModal && <StatsModal stats={stats} guesses={gameState.guesses} isGameWon={gameState.isGameWon} onClose={() => setShowStatsModal(false)} />}
      
      <h1>Anidle</h1>
      <p>Adivinhe o anime do dia!</p>
      
      <ImageClue imageUrl={dailyChallenge.imageUrl} isRevealed={isGameOver} blurLevel={blurLevel} />
      
      {gameState.isGameWon && <div className="win-message">Parabéns, você acertou!</div>}
      {gameState.isGameLost && <div className="lose-message">Não foi desta vez! O anime era **{correctAnswer || '...'}**</div>}

      <div className="notification-container fixed-top">
        {notification && <div className="notification">{notification}</div>}
      </div>

      {!isGameOver && <GuessInput onGuessSubmit={handleGuessSubmit} />}
      
      <GuessGrid guesses={gameState.guesses} />
    </div>
  );
};