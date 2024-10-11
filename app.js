const express = require("express");
const app = express();
const path = require("node:path");
const gamesRouter = require("./routes/gamesRouter");
const genresRouter = require("./routes/genresRouter");
const db = require("./db/queries");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use("/genres", genresRouter);
app.use("/games", gamesRouter);

app.get("/", async (req, res) => {
  /*
  const topgames = await db.getTopGames();
  res.render("index", { topgames: topgames });
  */
  res.render("index");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Express app - listening on port ${PORT}!`));
