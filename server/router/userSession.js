const router = require("express").Router();
const {
  getUserSessions,
  createUserSession,
  updateUserSession,
  deleteUserSession,
  deleteExpiredSessions,
} = require("../controllers/userSession");
const { protectRoute } = require("../middleware/auth");

router.get("/", getUserSessions);
router.post("/", createUserSession);
router.put("/:sessionId", updateUserSession);
router.delete("/:sessionId", deleteUserSession);
router.delete("/expired/cleanup", deleteExpiredSessions);

module.exports = router;
