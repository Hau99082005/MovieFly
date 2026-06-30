const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./lib/dbConnect");
const userRouter = require("./router/user");
const bannerRouter = require("./router/banner");
const userSessionRouter = require("./router/userSession");
const userProfileRouter = require("./router/userProfile");
const genresRouter = require("./router/genres");
const moviesRouter = require("./router/movies");
const ratingRouter = require("./router/ratings");
const watchlistRouter = require("./router/watchlist");

dbConnect();

const express = require("express");

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/banners", bannerRouter);
app.use("/api/sessions", userSessionRouter);
app.use("/api/userProfile", userProfileRouter);
app.use("/api/genres", genresRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/watchlist", watchlistRouter);

app.get("/", (req, res) => {
  res.json({ message: "MovieFly API Server" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
