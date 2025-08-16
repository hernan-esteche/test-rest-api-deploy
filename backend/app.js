import express from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import { moviesRouter } from './routes/movies.js';

const app = express();

app.disable('x-powered-by');

app.use(express.json());

app.use(corsMiddleware());

app.use('/movies', moviesRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
