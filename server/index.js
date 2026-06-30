const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./lib/dbConnect");
const userRouter = require("./router/user");
const bannerRouter = require("./router/banner");
const userSessionRouter = require("./router/userSession");

dbConnect();

const express = require("express");

const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/banners", bannerRouter);
app.use("/api/sessions", userSessionRouter);

app.get("/", (req, res) => {
  res.json({ message: "MovieFly API Server" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
