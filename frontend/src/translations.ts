export interface Translations {
  title: string;
  subtitle: string;
  statsButton: string;
  languageSwitch: {
    en: string;
    pt: string;
  };
  guessInput: {
    placeholder: string;
    submitButton: string;
  };
  gameMessages: {
    win: string;
    lose: string;
    loading: string;
    error: string;
    duplicateGuess: string;
  };
  stats: {
    title: string;
    games: string;
    winRate: string;
    currentStreak: string;
    bestStreak: string;
    distributionTitle: string;
    nextAnidle: string;
    shareButton: string;
    copied: string;
    loseMessage: string;
  };
  grid: {
    cover: string;
    name: string;
    studio: string;
    year: string;
    genres: string;
  };
}

export const translations: Record<string, Translations> = {
  en: {
    title: "Anidle",
    subtitle: "Guess the anime of the day!",
    statsButton: "View Statistics",
    languageSwitch: {
      en: "EN",
      pt: "PT"
    },
    guessInput: {
      placeholder: "Type the anime name...",
      submitButton: "Guess"
    },
    gameMessages: {
      win: "Congratulations, you got it right!",
      lose: "Not this time! The anime was **{answer}**",
      loading: "Loading challenge...",
      error: "Could not load the daily challenge. Is the backend running?",
      duplicateGuess: "You already guessed this anime!"
    },
    stats: {
      title: "📊 Your Statistics",
      games: "Games",
      winRate: "Win Rate",
      currentStreak: "Current",
      bestStreak: "Best Seq.",
      distributionTitle: "Guess Distribution",
      nextAnidle: "Next Anidle in",
      shareButton: "Share 🔗",
      copied: "Copied!",
      loseMessage: "Not this time..."
    },
    grid: {
      cover: "Cover",
      name: "Name",
      studio: "Studio",
      year: "Year",
      genres: "Genres"
    }
  },
  pt: {
    title: "Anidle",
    subtitle: "Adivinhe o anime do dia!",
    statsButton: "Ver Estatísticas",
    languageSwitch: {
      en: "EN",
      pt: "PT"
    },
    guessInput: {
      placeholder: "Digite o nome do anime...",
      submitButton: "Chutar"
    },
    gameMessages: {
      win: "Parabéns, você acertou!",
      lose: "Não foi desta vez! O anime era **{answer}**",
      loading: "Carregando desafio...",
      error: "Não foi possível carregar o desafio do dia. O backend está rodando?",
      duplicateGuess: "Você já chutou este anime!"
    },
    stats: {
      title: "📊 Suas Estatísticas",
      games: "Jogos",
      winRate: "de Vitórias",
      currentStreak: "Sequência",
      bestStreak: "Melhor Seq.",
      distributionTitle: "Distribuição de Tentativas",
      nextAnidle: "Próximo Anidle em",
      shareButton: "Compartilhar 🔗",
      copied: "Copiado!",
      loseMessage: "Não foi desta vez..."
    },
    grid: {
      cover: "Capa",
      name: "Nome",
      studio: "Estúdio",
      year: "Ano",
      genres: "Gêneros"
    }
  }
};

export const getTranslation = (lang: string, key: string): string => {
  const translation = translations[lang];
  if (!translation) return key;
  
  const keys = key.split('.');
  let value: any = translation;
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) break;
  }
  
  return value || key;
};
