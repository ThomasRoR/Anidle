import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getTranslation } from '../translations';

interface GuessInputProps {
  onGuessSubmit: (animeId: number) => void;
  language: string;
}

interface SearchResult {
  id: number;
  title: string;
}

export const GuessInput: React.FC<GuessInputProps> = ({ onGuessSubmit, language }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<SearchResult | null>(null);

  useEffect(() => {
    const timerId = setTimeout(() => {
      if (query.length > 2) {
        axios.get(`http://localhost:3001/api/search?q=${query}`)
          .then(response => setResults(response.data))
          .catch(console.error);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timerId);
  }, [query]);

  const handleSelectAnime = (anime: SearchResult) => {
    setSelectedAnime(anime);
    setQuery(anime.title);
    setResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAnime) {
      onGuessSubmit(selectedAnime.id);
      setQuery('');
      setSelectedAnime(null);
    }
  };

  return (
    <form className="guess-input-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={getTranslation(language, 'guessInput.placeholder')}
        />
        {results.length > 0 && (
          <ul className="search-results">
            {results.map(anime => (
              <li key={anime.id} onClick={() => handleSelectAnime(anime)}>
                {anime.title}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button type="submit" disabled={!selectedAnime}>
        {getTranslation(language, 'guessInput.submitButton')}
      </button>
    </form>
  );
};