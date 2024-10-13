const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

function formatDate(date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

const validateGame = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 250 })
    .withMessage("Title must be between 1 and 250 characters")
    .isAlphanumeric("en-US", { ignore: " " })
    .withMessage("Title must contain only alphanumeric characters and spaces"),

  body("overview")
    .optional() // Overview is optional
    .trim()
    .isLength({ max: 500 })
    .withMessage("Overview must be less than 500 characters"),

  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("release_date")
    .isDate({ format: "YYYY-MM-DD" }) // Validates if the input is a valid date in the expected format
    .withMessage("Please provide a valid date in the format YYYY-MM-DD.")
    .isBefore(new Date().toISOString().split("T")[0]) // Ensure date is before today's date (not in the future)
    .withMessage("Release date cannot be in the future.")
    .optional({ checkFalsy: true }), // Makes the field optional, so it can be left empty

  body("rating")
    .optional()
    .isInt({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),

  body("image_url")
    .optional()
    .trim()
    .isURL()
    .withMessage("Invalid URL format for the image"),
];

exports.getGames = async (req, res) => {
  const games = await db.getAllGames();
  res.render("allgames", { games: games });
};

exports.getGame = async (req, res) => {
  const game = await db.getGame(req.params.id);
  res.render("game", { game });
};

exports.createGameGet = async (req, res) => {
  const genres = await db.getAllGenres();
  res.render("newgame", { genres: genres });
};

exports.createGame = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    const genres2 = await db.getAllGenres();
    if (!errors.isEmpty()) {
      return res.status(400).render("newgame", {
        errors: errors.array(),
        genres: genres2,
      });
    }

    const { title, overview, release_date, price, rating, image_url, genres } =
      req.body;

    const insertedGame = await db.addGame({
      title,
      overview,
      release_date,
      price,
      rating,
      image_url,
    });

    const gameId = insertedGame.rows[0].game_id;
    if (genres && genres.length > 0) {
      genres.map(async (genreId) => {
        await db.addgamegenre(gameId, genreId);
      });
    }

    res.redirect("/");
  },
];

exports.gameUpdateGet = async (req, res) => {
  const game = await db.getGame(req.params.id);
  const selectedgenres = await db.getGenresinGame(req.params.id);
  const genres = await db.getAllGenres();
  game.release_date = formatDate(game.release_date);
  res.render("updategame", {
    game: game,
    genres,
    genres,
    selectedgenres: selectedgenres,
  });
};

exports.updateGame = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    const game = await db.getGame(req.params.id);
    const selectedgenres = await db.getGenresinGame(req.params.id);
    const genres2 = await db.getAllGenres();
    if (!errors.isEmpty()) {
      return res.status(400).render("updategame", {
        game: game,
        genres: genres2,
        selectedgenres: selectedgenres,
        errors: errors.array(),
      });
    }
    const { title, overview, release_date, price, rating, image_url, genres } =
      req.body;
    await db.updateGame(req.params.id, {
      title,
      overview,
      release_date,
      price,
      rating,
      image_url,
    });

    if (genres && genres.length > 0) {
      genres.map(async (genreId) => {
        await db.addgamegenre(req.params.id, genreId);
      });
    }

    res.redirect("/");
  },
];

exports.deleteGame = async (req, res) => {
  await db.deleteGame(req.params.id);
  res.redirect("/");
};
