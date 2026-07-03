const router = require("express").Router();
const { handleClerkWebhook } = require("../controllers/clerk_webhook");

router.post("/", handleClerkWebhook);

module.exports = router;
