import { validateMovie, validatePartialMovie } from '../schemas/movies.js';

export class MovieController {
	constructor({ movieModel }) {
		this.movieModel = movieModel;
	}
	getAllMovies = async (req, res) => {
		const { genre } = req.query;
		const filteredMovies = await this.movieModel.getAll({ genre });
		return res.json(filteredMovies);
	};

	getMovieById = async (req, res) => {
		const { id } = req.params;
		const movie = await this.movieModel.getById({ id });
		if (movie) return res.json(movie);
		res.status(404).json({ error: 'Movie not found' });
	};

	createMovie = async (req, res) => {
		const result = validateMovie(req.body);
		if (!result.success) {
			return res.status(400).json({ error: result.error.issues });
		}

		const newMovie = await this.movieModel.create({ data: result.data });

		res.status(201).json(newMovie);
	};

	updateMovie = async (req, res) => {
		const { id } = req.params;

		const result = validatePartialMovie(req.body);
		if (!result.success) {
			return res.status(400).json({ error: result.error.issues });
		}

		const updateMovie = await this.movieModel.update({ id, data: result.data });
		if (updateMovie.error) {
			return res.status(404).json(updateMovie);
		}
		res.json(updateMovie);
	};

	deleteMovie = async (req, res) => {
		const { id } = req.params;
		const result = await this.movieModel.delete({ id });
		if (result.error) {
			return res.status(404).json(result);
		}

		res.status(200).json(result);
	};
}
