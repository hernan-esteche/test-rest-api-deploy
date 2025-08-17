/** biome-ignore-all lint/complexity/noStaticOnlyClass: <> */
import mysql from 'mysql2/promise';

const config = {
	host: 'localhost',
	user: 'root',
	port: 3306,
	password: '',
	database: 'moviesdb',
};

const connection = await mysql.createConnection(config);

export class MovieModel {
	static async getAll({ genre }) {
		if (!genre) {
			const [movies] = await connection.query(`
      SELECT 
        BIN_TO_UUID(m.id) AS id,
        m.title,
        m.year,
        m.director,
        m.duration,
        m.poster,
        m.rate
      FROM movie m
    `);
			return movies;
		}

		const [movies] = await connection.query(
			`
  SELECT 
    BIN_TO_UUID(m.id) AS id,
    m.title,
    m.year,
    m.director,
    m.duration,
    m.poster,
    m.rate
  FROM movie m
  JOIN movie_genres mg ON m.id = mg.movie_id
  JOIN genre g ON g.id = mg.genre_id
  WHERE LOWER(g.name) = LOWER(?);
`,
			[genre],
		);
		return movies;
	}

	static async getById({ id }) {
		const [movies] = await connection.query(
			`
  SELECT 
    BIN_TO_UUID(m.id) AS id,
    m.title,
    m.year,
    m.director,
    m.duration,
    m.poster,
    m.rate
  FROM movie m
  WHERE m.id = UUID_TO_BIN(?);
`,
			[id],
		);
		return movies;
	}

	static async create({ data }) {
		const { title, year, director, duration, poster, rate } = data;

		const [uuidResult] = await connection.query('SELECT UUID() uuid;');
		const [{ uuid }] = uuidResult;

		try {
			await connection.query(
				`INSERT INTO movie (id, title, year, director, duration, poster, rate)
				VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
				[title, year, director, duration, poster, rate],
			);
		} catch (error) {
			throw new Error(`Error creating movie: ${error.message}`);
		}

		const [movies] = await connection.query(
			`
  SELECT 
    BIN_TO_UUID(m.id) AS id,
    m.title,
    m.year,
    m.director,
    m.duration,
    m.poster,
    m.rate
  FROM movie m
  WHERE m.id = UUID_TO_BIN(?);
`,
			[uuid],
		);
		return movies;
	}

	static async update({ id, data }) {
		const { title, year, director, duration, poster, rate } = data;

		try {
			await connection.query(
				`
      UPDATE movie
      SET
        title = COALESCE(?, title),
        year = COALESCE(?, year),
        director = COALESCE(?, director),
        duration = COALESCE(?, duration),
        poster = COALESCE(?, poster),
        rate = COALESCE(?, rate)
      WHERE id = UUID_TO_BIN(?);
      `,
				[title, year, director, duration, poster, rate, id],
			);
		} catch (error) {
			return { error: `Error updating movie: ${error.message}` };
		}

		const [movies] = await connection.query(
			`
	SELECT 
		BIN_TO_UUID(m.id) AS id,
		m.title,
		m.year,
		m.director,
		m.duration,
		m.poster,
		m.rate
	FROM movie m
	WHERE m.id = UUID_TO_BIN(?);`,
			[id],
		);
		return movies;
	}

	static async delete({ id }) {
		try {
			await connection.query(`DELETE FROM movie WHERE id = UUID_TO_BIN(?);`, [
				id,
			]);
			return { message: 'Movie deleted successfully' };
		} catch (error) {
			return { error: `Error deleting movie: ${error.message}` };
		}
	}
}
