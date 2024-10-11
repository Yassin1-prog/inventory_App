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
  res.render("genres", { genres: genres });
};

exports.createGenre = [
  validateGenre,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newGenre", {
        title: "Create user",
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
  res.render("updateGenre", {
    title: "Update user",
    genre: genre,
  });
};

exports.updateGenre = [
  validateGenre,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("newGenre", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { name, description, image_url } = req.body;
    await db.updateGenre({ name, description, image_url });
    res.redirect("/");
  },
];
