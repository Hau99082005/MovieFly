const router = require("express").Router();
const {
  getAllUserSubscriptions,
  getUserSubscriptionById,
  getUserSubscriptionsByUserId,
  getActiveUserSubscription,
  createUserSubscription,
  updateUserSubscription,
  renewUserSubscription,
  cancelUserSubscription,
  deleteUserSubscription,
  checkSubscriptionExpiry,
} = require("../controllers/user_subscriptions");

router.get("/", getAllUserSubscriptions);
router.get("/:id", getUserSubscriptionById);
router.get("/user/:userId", getUserSubscriptionsByUserId);
router.get("/user/:userId/active", getActiveUserSubscription);
router.post("/", createUserSubscription);
router.put("/:id", updateUserSubscription);
router.put("/:id/renew", renewUserSubscription);
router.put("/:id/cancel", cancelUserSubscription);
router.delete("/:id", deleteUserSubscription);
router.post("/check-expiry", checkSubscriptionExpiry);

module.exports = router;
