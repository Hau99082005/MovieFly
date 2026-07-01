const router = require("express").Router();
const {
  getAllWatchHistory,
  getWatchHistoryByUserId,
  getContinueWatching,
  getWatchHistoryById,
  createOrUpdateWatchHistory,
  updateProgress,
  deleteWatchHistory,
  clearWatchHistory,
  getWatchStatistics,
} = require("../controllers/watch_history");

router.get("/", getAllWatchHistory);
router.get("/user/:userId", getWatchHistoryByUserId);
router.get("/user/:userId/continue", getContinueWatching);
router.get("/user/:userId/stats", getWatchStatistics);
router.get("/:id", getWatchHistoryById);
router.post("/", createOrUpdateWatchHistory);
router.patch("/:id/progress", updateProgress);
router.delete("/:id", deleteWatchHistory);
router.delete("/user/:userId/clear", clearWatchHistory);

module.exports = router;
