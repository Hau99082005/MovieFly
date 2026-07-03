const router = require("express").Router();
const {
  getSettings,
  updateSettings,
} = require("../controllers/settings");

router.get("/", getSettings);
router.put("/", updateSettings);

module.exports = router;
