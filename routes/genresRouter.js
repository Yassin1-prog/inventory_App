// routes/authorsRouter.js
const { Router } = require("express");
const genresController = require("../controllers/genresController");

const genresRouter = Router();

genresRouter.get("/", genresController.getGenres);
genresRouter.get("/create", (req, res) => res.render("newgenre"));

module.exports = genresRouter;
