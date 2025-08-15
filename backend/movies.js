import { z } from 'zod';

const movieSchema = z.object({
	title: z
		.string({
			required_error: 'Title is required',
			invalid_type_error: 'Title must be a string',
		})
		.min(2)
		.max(100),
	year: z
		.number({
			required_error: 'Year is required',
			invalid_type_error: 'Year must be a number',
		})
		.min(1888)
		.max(new Date().getFullYear()),
	director: z
		.string({
			required_error: 'Director is required',
			invalid_type_error: 'Director must be a string',
		})
		.min(2)
		.max(100),
	duration: z
		.number({
			required_error: 'Duration is required',
			invalid_type_error: 'Duration must be a number',
		})
		.min(1)
		.int()
		.positive(),
	poster: z.url({ message: 'Poster must be a valid URL' }),
	genre: z.array(
		z.enum([
			'Action',
			'Comedy',
			'Drama',
			'Fantasy',
			'Horror',
			'Mystery',
			'Romance',
			'Thriller',
			'Animation',
			'Sci-Fi',
			'Adventure',
		]),
		{
			required_error: 'Genre is required',
			invalid_type_error: 'Genre must be an array of valid genres',
		},
	),
	rate: z.number().min(0).max(10).optional(),
});

function validateMovie(data) {
	return movieSchema.safeParse(data);
}
function validatePartialMovie(data) {
	return movieSchema
		.partial()
		.refine((obj) => Object.keys(obj).length > 0, {
			message: 'At least one field must be provided',
		})
		.safeParse(data);
}

export { validateMovie, validatePartialMovie };
