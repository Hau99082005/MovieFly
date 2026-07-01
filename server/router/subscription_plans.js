const router = require("express").Router();
const {
  getAllSubscriptionPlans,
  getActiveSubscriptionPlans,
  getSubscriptionPlanById,
  getSubscriptionPlanBySlug,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} = require("../controllers/subscription_plans");

router.get("/", getAllSubscriptionPlans);
router.get("/active", getActiveSubscriptionPlans);
router.get("/id/:id", getSubscriptionPlanById);
router.get("/slug/:slug", getSubscriptionPlanBySlug);
router.post("/", createSubscriptionPlan);
router.put("/:id", updateSubscriptionPlan);
router.delete("/:id", deleteSubscriptionPlan);

module.exports = router;
