// routes/authorsRouter.js
const { Router } = require("express");

const gamesRouter = Router();

gamesRouter.get("/", (req, res) => res.render("games"));
gamesRouter.get("/create", (req, res) => res.render("newgame"));

module.exports = gamesRouter;
