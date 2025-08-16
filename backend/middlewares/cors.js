import cors from 'cors';

const ALLOWED_ORIGINS = [
	'https://my-frontend.onrender.com',
	'http://127.0.0.1:5500',
];

export const corsMiddleware = ({ acceptedOrigins = ALLOWED_ORIGINS } = {}) =>
	cors({
		origin: (origin, callback) => {
			if (!origin || acceptedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				callback(new Error('No permitido por CORS'));
			}
		},
		methods: ['GET', 'POST', 'PATCH', 'DELETE'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	});
