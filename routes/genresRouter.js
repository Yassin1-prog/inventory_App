// routes/authorsRouter.js
const { Router } = require("express");

const genresRouter = Router();

genresRouter.get("/", (req, res) => res.send("All authors"));

module.exports = genresRouter;
