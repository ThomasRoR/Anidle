// backend/src/server.ts

import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
import { getDayOfYear, isSameDay } from 'date-fns';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let animeOfTheDay: any = null;
let lastUpdatedDate: Date | null = null;
const API_FIELDS = 'id,title,main_picture,synopsis,mean,genres,start_date,studios';

async function updateAnimeOfTheDay() {
  try {
    const accessToken = process.env.MAL_ACCESS_TOKEN;
    if (!accessToken) throw new Error('Access Token do MyAnimeList não encontrado.');

    const randomOffset = Math.floor(Math.random() * 1000);
    
    const malApiUrl = `https://api.myanimelist.net/v2/anime/ranking?ranking_type=all&limit=1&offset=${randomOffset}&fields=${API_FIELDS}`;
    
    console.log(`Buscando novo anime do dia com offset aleatório: ${malApiUrl}`);

    const response = await axios.get(malApiUrl, {
      headers: { 'Authorization': `Bearer ${accessToken}` },
    });

    if (response.data.data.length > 0) {
      animeOfTheDay = response.data.data[0].node;
      lastUpdatedDate = new Date();
      console.log(`🎉 Novo Anime do Dia definido: ${animeOfTheDay.title}`);
    } else {
      console.warn("Offset aleatório não retornou resultados, tentando novamente...");
      await updateAnimeOfTheDay();
    }
  } catch (error: any) {
    console.error("Erro crítico ao atualizar o anime do dia:", error.message);
  }
}

app.use(async (req, res, next) => {
  const today = new Date();
  if (!animeOfTheDay || !lastUpdatedDate || !isSameDay(lastUpdatedDate, today)) {
    await updateAnimeOfTheDay();
  }
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('<h1>Bem-vindo ao Backend do Anidle!</h1><p>Acesse /api/daily-challenge para obter o desafio do dia.</p>');
});


app.get('/api/daily-challenge', (req: Request, res: Response) => {
  if (!animeOfTheDay) return res.status(500).json({ message: 'O desafio do dia não está disponível.' });
  res.json({
    id: animeOfTheDay.id,
    imageUrl: animeOfTheDay.main_picture.large,
  });
});

app.get('/api/answer', (req: Request, res: Response) => {
  if (!animeOfTheDay) {
    return res.status(500).json({ message: 'O desafio do dia não está disponível.' });
  }
  res.json({
    title: animeOfTheDay.title
  });
});


app.post('/api/check-guess', async (req: Request, res: Response) => {
  const { guessId } = req.body;
  if (!guessId) return res.status(400).json({ message: 'ID do chute não fornecido.' });
  if (!animeOfTheDay) return res.status(500).json({ message: 'O desafio do dia não está disponível.' });

  try {
    const accessToken = process.env.MAL_ACCESS_TOKEN;
    const guessedAnimeResponse = await axios.get(`https://api.myanimelist.net/v2/anime/${guessId}?fields=${API_FIELDS}`, {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    const guessedAnime = guessedAnimeResponse.data;

    const feedback = {
      isCorrect: guessedAnime.id === animeOfTheDay.id,
      guessedAnimeData: guessedAnime,
      feedbackOn: {
        title: 'incorreto', studio: 'incorreto', year: 'incorreto', genres: 'incorreto',
      }
    };

    if (guessedAnime.id === animeOfTheDay.id) {
        feedback.feedbackOn.title = 'correto';
    } else {
        const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9\s]/gi, '').split(' ');
        const correctWords = new Set(normalize(animeOfTheDay.title));
        const guessedWords = normalize(guessedAnime.title);
        const hasCommonWord = guessedWords.some(word => word.length > 2 && correctWords.has(word));
        if (hasCommonWord) {
            feedback.feedbackOn.title = 'parcial';
        }
    }

    const correctStudio = animeOfTheDay.studios[0]?.name;
    const guessedStudio = guessedAnime.studios[0]?.name;
    if (correctStudio && guessedStudio && correctStudio === guessedStudio) {
      feedback.feedbackOn.studio = 'correto';
    }

    const correctYear = new Date(animeOfTheDay.start_date).getFullYear();
    const guessedYear = new Date(guessedAnime.start_date).getFullYear();
    if (correctYear && guessedYear && correctYear === guessedYear) {
      feedback.feedbackOn.year = 'correto';
    }
    
    const correctGenres = animeOfTheDay.genres.map((g: any) => g.name);
    const guessedGenres = guessedAnime.genres.map((g: any) => g.name);
    const commonGenres = correctGenres.filter((g: string) => guessedGenres.includes(g));
    
    if (commonGenres.length === correctGenres.length && commonGenres.length === guessedGenres.length) {
      feedback.feedbackOn.genres = 'correto';
    } else if (commonGenres.length > 0) {
      feedback.feedbackOn.genres = 'parcial';
    }

    res.json(feedback);
  } catch (error: any) {
    console.error('Erro ao verificar chute:', error.response?.data || error.message);
    res.status(500).json({ message: 'Não foi possível verificar o chute.' });
  }
});

app.get('/api/search', async (req: Request, res: Response) => {
    const query = req.query.q as string;
    if (!query) return res.status(400).json({ message: 'Termo de busca não fornecido.' });

    try {
        const accessToken = process.env.MAL_ACCESS_TOKEN;
        const response = await axios.get(`https://api.myanimelist.net/v2/anime?q=${query}&limit=5&fields=id,title,main_picture`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        res.json(response.data.data.map((item: any) => item.node));
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar animes.' });
    }
});

app.post('/api/admin/reset', async (req: Request, res: Response) => {
  const { secret } = req.body;
  if (secret !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: 'Acesso negado. Chave de admin inválida.' });
  }
  try {
    await updateAnimeOfTheDay();
    res.status(200).json({ 
      message: 'Anime do dia resetado com sucesso!',
      newAnime: animeOfTheDay?.title || 'Não definido'
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Erro ao tentar resetar o anime.', error: error.message });
  }
});

app.listen(PORT, () => {
  updateAnimeOfTheDay();
  console.log(`🎉 Servidor Anidle Backend rodando em http://localhost:${PORT}`);
});