const pool = require("./db");

async function getTopGames() {
  const { rows } = await pool.query(
    "SELECT * FROM game ORDER BY rating DESC LIMIT 5"
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

async function addGame({
  title,
  overview,
  release_date,
  price,
  rating,
  image_url,
}) {
  await pool.query(
    "INSERT INTO game (title, overview, release_date, price, rating, image_url) VALUES ($1, $2, $3, $4, $5, $6)",
    [title, overview, release_date, price, rating, image_url]
  );
}

async function addGenre({ name, description, image_url }) {
  await pool.query(
    "INSERT INTO genre (name, description, image_url) VALUES ($1, $2, $3)",
    [name, description, image_url]
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

module.exports = {
  getAllGames,
  getTopGames,
  getGame,
  getAllGenres,
  getGenre,
  addGame,
  addGenre,
  updateGame,
  updateGenre,
  deleteGame,
};
