import { MovieModel } from '../models/movie.js';
import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

export class MovieController {
	static async getAllMovies(req, res) {
		const { genre } = req.query;
		const filteredMovies = await MovieModel.getAll({ genre });
		return res.json(filteredMovies);
	}

	static async getMovieById(req, res) {
		const { id } = req.params;
		const movie = await MovieModel.getById({ id });
		if (movie) return res.json(movie);
		res.status(404).json({ error: 'Movie not found' });
	}

	static async createMovie(req, res) {
		const result = validateMovie(req.body);
		if (!result.success) {
			return res.status(400).json({ error: result.error.issues });
		}

		const newMovie = await MovieModel.create({ data: result.data });

		res.status(201).json(newMovie);
	}

	static async updateMovie(req, res) {
		const { id } = req.params;

		const result = validatePartialMovie(req.body);
		if (!result.success) {
			return res.status(400).json({ error: result.error.issues });
		}

		const updateMovie = await MovieModel.update({ id, data: result.data });
		if (updateMovie.error) {
			return res.status(404).json(updateMovie);
		}
		res.json(updateMovie);
	}

	static async deleteMovie(req, res) {
		const { id } = req.params;
		const result = await MovieModel.delete({ id });
		if (result.error) {
			return res.status(404).json(result);
		}
		res.status(204).json(result);
	}
}
