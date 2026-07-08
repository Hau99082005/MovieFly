const dotenv = require("dotenv");
dotenv.config();
const dbConnect = require("./lib/dbConnect");
const userRouter = require("./router/user");
const adminRouter = require("./router/admin");
const clerkWebhookRouter = require("./router/clerk_webhook");
const bannerRouter = require("./router/banner");
const userSessionRouter = require("./router/userSession");
const userProfileRouter = require("./router/userProfile");
const genresRouter = require("./router/genres");
const moviesRouter = require("./router/movies");
const ratingRouter = require("./router/ratings");
const watchlistRouter = require("./router/watchlist");
const movieGenresRouter = require("./router/moviegenres");
const seasonsRouter = require("./router/seasons");
const episodesRouter = require("./router/episodes");
const commentsRouter = require("./router/comments");
const watchHistoryRouter = require("./router/watch_history");
const countriesRouter = require("./router/countries");
const peopleRouter = require("./router/people");
const movieCastRouter = require("./router/movie_cast");
const subtitlesRouter = require("./router/subtitles");
const subscriptionPlansRouter = require("./router/subscription_plans");
const userSubscriptionsRouter = require("./router/user_subscriptions");
const videoSourceRouter = require("./router/video_source");
const paymentsMethodRouter = require("./router/payments_method");
const transactionsRouter = require("./router/transactions");
const settingsRouter = require("./router/settings");
const notificationRouter = require("./router/notificationRoutes");

dbConnect();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/webhooks/clerk", clerkWebhookRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/banners", bannerRouter);
app.use("/api/sessions", userSessionRouter);
app.use("/api/userProfile", userProfileRouter);
app.use("/api/genres", genresRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/ratings", ratingRouter);
app.use("/api/watchlist", watchlistRouter);
app.use("/api/moviegenres", movieGenresRouter);
app.use("/api/seasons", seasonsRouter);
app.use("/api/episodes", episodesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/watch-history", watchHistoryRouter);
app.use("/api/countries", countriesRouter);
app.use("/api/people", peopleRouter);
app.use("/api/movie-cast", movieCastRouter);
app.use("/api/subtitles", subtitlesRouter);
app.use("/api/subscription-plans", subscriptionPlansRouter);
app.use("/api/user-subscriptions", userSubscriptionsRouter);
app.use("/api/video-sources", videoSourceRouter);
app.use("/api/payments-method", paymentsMethodRouter);
app.use("/api/transactions", transactionsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/notifications", notificationRouter);
app.get("/", (req, res) => {
  console.log("📡 Root endpoint accessed");
  res.json({ message: "MovieFly API Server" });
});

app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  next();
});

const server = app.listen(PORT, () => {
  console.log("\n");
  console.log("=".repeat(50));
  console.log("🚀 MovieFly Server Started Successfully!");
  console.log("=".repeat(50));
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`📍 API Base: http://localhost:${PORT}/api`);
  console.log(`🔗 Client URL: http://localhost:5173`);
  console.log(
    `📊 MongoDB: ${process.env.MONGODB_URI ? "✅ Connected" : "❌ Not configured"}`,
  );
  console.log(`📡 SSE Stream: http://localhost:${PORT}/api/notifications/stream`);
  console.log("=".repeat(50));
  console.log("\n💡 Test endpoints:");
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/api/notifications/stream`);
  console.log(`  GET  http://localhost:${PORT}/api/notifications/user/:userId`);
  console.log("\n🔍 Waiting for requests...\n");
});

// Tăng timeout socket để SSE connections không bị đóng sớm
server.keepAliveTimeout = 0;
server.headersTimeout = 0;
