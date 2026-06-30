const router = require("express").Router();
const {
  getWatchlist,
  getWatchlistById,
  addToWatchlist,
  removeFromWatchlist,
  clearWatchlist,
  getWatchlistCount,
  checkInWatchlist,
} = require("../controllers/watchlist");

router.get("/", getWatchlist);
router.get("/count", getWatchlistCount);
router.get("/check", checkInWatchlist);
router.get("/:id", getWatchlistById);
router.post("/", addToWatchlist);
router.delete("/", removeFromWatchlist);
router.delete("/clear", clearWatchlist);

module.exports = router;
