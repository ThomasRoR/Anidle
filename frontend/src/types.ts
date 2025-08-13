export interface Guess {
  guessedAnimeData: any;
  feedbackOn: {
    title: 'correto' | 'parcial' | 'incorreto';
    studio: 'correto' | 'incorreto';
    year: 'correto' | 'incorreto';
    genres: 'correto' | 'parcial' | 'incorreto';
  };
}

export interface GameState {
  date: string;
  guesses: Guess[];
  isGameWon: boolean;
  isGameLost: boolean;
}

export interface StatsState {
  gamesPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
  };
}