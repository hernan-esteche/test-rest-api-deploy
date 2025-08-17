import { Router } from 'express';
import { MovieController } from '../controllers/movies.js';

export const createMovieRouter = ({ movieModel }) => {
	const moviesRouter = Router();
	const movieController = new MovieController({ movieModel });

	moviesRouter.get('/', movieController.getAllMovies);
	moviesRouter.get('/:id', movieController.getMovieById);
	moviesRouter.post('/', movieController.createMovie);
	moviesRouter.patch('/:id', movieController.updateMovie);
	moviesRouter.put('/:id', movieController.updateMovie);
	moviesRouter.delete('/:id', movieController.deleteMovie);

	return moviesRouter;
};
