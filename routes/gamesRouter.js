// routes/authorsRouter.js
const { Router } = require("express");

const gamesRouter = Router();
const gamesController = require("../controllers/gamesController");

gamesRouter.get("/", gamesController.getGames);
gamesRouter.get("/create", (req, res) => res.render("newgame"));
gamesRouter.post("/create", gamesController.createGame);
gamesRouter.get("/:id", gamesController.getGame);
gamesRouter.get("/:id/update", gamesController.gameUpdateGet);
gamesRouter.post("/:id/update", gamesController.updateGame);
gamesRouter.post("/:id/delete", gamesController.deleteGame);

module.exports = gamesRouter;
