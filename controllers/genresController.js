const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const validateGenre = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Name must be between 1 and 55 characters")
    .isAlpha("en-US", { ignore: " " }) // Allow alphabetic characters and spaces
    .withMessage("Name must contain only alphabetic characters and spaces"),

  body("description")
    .optional() // Description is not required, but we still want to validate if provided
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 200 characters"),

  body("image_url")
    .optional() // Image URL is optional
    .trim()
    .isURL()
    .withMessage("Invalid URL format for the image"),
];

exports.getGenres = async (req, res) => {
  const genres = await db.getAllGenres();
  res.render("allgenres", { genres: genres });
};

exports.getGenre = async (req, res) => {
  const genre = await db.getGenre(req.params.id);
  const games = await db.getGamesInGenre(genre.genre_id);
  res.render("genre", { genre: genre, games: games });
};

exports.createGenre = [
  validateGenre,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newgenre", {
        errors: errors.array(),
      });
    }
    const { name, description, image_url } = req.body;
    await db.addGenre({ name, description, image_url });
    res.redirect("/");
  },
];

exports.genreUpdateGet = async (req, res) => {
  const genre = await db.getGenre(req.params.id);
  res.render("updategenre", {
    genre: genre,
  });
};

exports.updateGenre = [
  validateGenre,
  async (req, res) => {
    const errors = validationResult(req);
    const genre = await db.getGenre(req.params.id);
    if (!errors.isEmpty()) {
      return res.status(400).render("newGenre", {
        genre: genre,
        errors: errors.array(),
      });
    }
    const { name, description, image_url } = req.body;
    await db.updateGenre(req.params.id, { name, description, image_url });
    res.redirect("/");
  },
];

exports.deleteGenre = async (req, res) => {
  await db.deleteGenre(req.params.id);
  res.redirect("/");
};
