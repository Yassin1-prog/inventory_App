const pool = require("../db");

async function getTopGames() {
  const { rows } = await pool.query(
    "SELECT * FROM game ORDER BY rating DESC LIMIT 8"
  );
  return rows;
}

async function getAllGames() {
  const { rows } = await pool.query("SELECT * FROM game");
  return rows;
}

async function getGame(id) {
  const { rows } = await pool.query("SELECT * FROM game WHERE game_id = $1", [
    id,
  ]);
  return rows[0];
}

async function getAllGenres() {
  const { rows } = await pool.query("SELECT * FROM genre");
  return rows;
}

async function getGenre(id) {
  const { rows } = await pool.query("SELECT * FROM genre WHERE genre_id = $1", [
    id,
  ]);
  return rows[0];
}

async function getGamesInGenre(id) {
  const { rows } = await pool.query(
    "SELECT * FROM game_genre d INNER JOIN game g ON d.game_id = g.game_id WHERE d.genre_id = $1",
    [id]
  );
  return rows;
}

async function getGenresinGame(id) {
  const { rows } = await pool.query(
    "SELECT * FROM game_genre d INNER JOIN genre g ON d.genre_id = g.genre_id WHERE d.game_id = $1",
    [id]
  );
  return rows;
}

async function addGame({
  title,
  overview,
  release_date,
  price,
  rating,
  image_url,
}) {
  return await pool.query(
    "INSERT INTO game (title, overview, release_date, price, rating, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING game_id",
    [title, overview, release_date, price, rating, image_url]
  );
}

async function addGenre({ name, description, image_url }) {
  await pool.query(
    "INSERT INTO genre (name, description, image_url) VALUES ($1, $2, $3)",
    [name, description, image_url]
  );
}

async function addgamegenre(gameId, genreId) {
  await pool.query(
    "INSERT INTO game_genre (game_id, genre_id) VALUES ($1, $2) ON CONFLICT (game_id, genre_id) DO NOTHING",
    [gameId, genreId]
  );
}

async function updateGame(
  id,
  { title, overview, release_date, price, rating, image_url }
) {
  await pool.query(
    "UPDATE game SET title = $1, overview = $2, release_date = $3, price = $4, rating = $5, image_url = $6 WHERE game_id = $7",
    [title, overview, release_date, price, rating, image_url, id]
  );
}

async function updateGenre(id, { name, description, image_url }) {
  await pool.query(
    "UPDATE genre SET name = $1, description = $2, image_url = $3 WHERE genre_id = $4",
    [name, description, image_url, id]
  );
}

async function deleteGame(id) {
  await pool.query("DELETE FROM game WHERE game_id = $1", [id]);
}

async function deleteGenre(id) {
  await pool.query("DELETE FROM genre WHERE genre_id = $1", [id]);
}

module.exports = {
  getAllGames,
  getTopGames,
  getGame,
  getAllGenres,
  getGenre,
  getGamesInGenre,
  getGenresinGame,
  addGame,
  addGenre,
  addgamegenre,
  updateGame,
  updateGenre,
  deleteGame,
  deleteGenre,
};
