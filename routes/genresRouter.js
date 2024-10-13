// routes/authorsRouter.js
const { Router } = require("express");
const genresController = require("../controllers/genresController");

const genresRouter = Router();

genresRouter.get("/", genresController.getGenres);
genresRouter.get("/create", (req, res) => res.render("newgenre"));
genresRouter.post("/create", genresController.createGenre);
genresRouter.get("/:id", genresController.getGenre);
genresRouter.get("/:id/update", genresController.genreUpdateGet);
genresRouter.post("/:id/update", genresController.updateGenre);
genresRouter.post("/:id/delete", genresController.deleteGenre);

module.exports = genresRouter;
