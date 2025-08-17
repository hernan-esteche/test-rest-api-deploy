/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import crypto from 'node:crypto';
import movies from '../movies.json' with { type: 'json' };

export class MovieModel {
	static async getAll({ genre }) {
		if (genre) {
			const filteredMovies = movies.filter((movie) =>
				movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
			);
			return filteredMovies;
		}
		return movies;
	}

	static async getById({ id }) {
		const movie = movies.find((movie) => movie.id === id);
		return movie;
	}

	static async create({ data }) {
		const newMovie = {
			id: crypto.randomUUID(),
			...data,
		};
		movies.push(newMovie);
		return newMovie;
	}

	static async update({ id, data }) {
		const movie = movies.find((movie) => movie.id === id);
		if (!movie) return { error: 'Movie not found' };
		Object.assign(movie, data);
		return movie;
	}

	static async delete({ id }) {
		const movieIndex = movies.findIndex((movie) => movie.id === id);
		if (movieIndex === -1) return { error: 'Movie not found' };
		movies.splice(movieIndex, 1);
		return { message: 'Movie deleted successfully' };
	}
}

// export const getFilteredMovies = async ({ genre }) => {
// 	if (genre) {
// 		const filteredMovies = movies.filter((movie) =>
// 			movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase()),
// 		);
// 		return filteredMovies;
// 	}
// 	return movies;
// };
