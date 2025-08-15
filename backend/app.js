import crypto from 'node:crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { validateMovie, validatePartialMovie } from './movies.js';
import movies from './movies.json' with { type: 'json' };

dotenv.config();

const app = express();
app.disable('x-powered-by');

app.use(express.json());

const allowedOrigins = [
	'https://my-frontend.onrender.com',
	'http://127.0.0.1:5500',
];

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('No permitido por CORS'));
			}
		},
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);

app.get('/movies', (req, res) => {
	const { genre } = req.query;
	if (genre) {
		const filteredMovies = movies.filter((movie) =>
			movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
		);
		return res.json(filteredMovies);
	}
	res.json(movies);
});

app.get('/movies/:id', (req, res) => {
	const { id } = req.params;
	const movie = movies.find((movie) => movie.id === id);
	if (movie) return res.json(movie);
	res.status(404).json({ error: 'Movie not found' });
});

app.post('/movies', (req, res) => {
	const result = validateMovie(req.body);
	if (!result.success) {
		return res.status(400).json({ error: result.error.issues });
	}

	const newMovie = {
		id: crypto.randomUUID(),
		...result.data,
	};

	movies.push(newMovie);
	res.status(201).json(movies);
});

app.patch('/movies/:id', (req, res) => {
	const { id } = req.params;
	const movie = movies.find((movie) => movie.id === id);
	if (!movie) return res.status(404).json({ error: 'Movie not found' });

	const result = validatePartialMovie(req.body);
	if (!result.success) {
		return res.status(400).json({ error: result.error.issues });
	}

	Object.assign(movie, result.data);
	res.json(movie);
});

app.put('/movies/:id', (req, res) => {
	const { id } = req.params;
	const movie = movies.find((movie) => movie.id === id);
	if (!movie) return res.status(404).json({ error: 'Movie not found' });

	const result = validateMovie(req.body);
	if (!result.success) {
		return res.status(400).json({ error: result.error.issues });
	}
	Object.assign(movie, result.data);
	res.json(movie);
});

app.delete(`/movies/:id`, (req, res) => {
	const { id } = req.params;
	console.log(id);
	const movieIndex = movies.findIndex((movie) => movie.id === id);
	if (movieIndex === -1)
		return res.status(404).json({ error: 'Movie not found' });

	movies.splice(movieIndex, 1);
	res.status(204).send();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
