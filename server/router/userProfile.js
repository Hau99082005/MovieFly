const router = require("express").Router();
const {
  getUserProfile,
  createUserProfile,
  updateUserProfile,
  deleteUserProfile,
} = require("../controllers/userProfile");

router.get("/", getUserProfile);
router.post("/", createUserProfile);
router.put("/", updateUserProfile);
router.delete("/", deleteUserProfile);

module.exports = router;
