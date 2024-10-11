// routes/authorsRouter.js
const { Router } = require("express");

const genresRouter = Router();

genresRouter.get("/", (req, res) => res.render("genres"));
genresRouter.get("/create", (req, res) => res.render("newgenre"));

module.exports = genresRouter;
