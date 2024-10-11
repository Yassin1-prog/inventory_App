// routes/authorsRouter.js
const { Router } = require("express");

const gamesRouter = Router();

gamesRouter.get("/", (req, res) => res.send("All authors"));

module.exports = gamesRouter;
