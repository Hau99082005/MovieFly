const router = require("express").Router();

const { getUser, loginUser, createUser, syncClerkUser, deleteUserByEmail } = require("../controllers/user");
const { protectRoute } = require("../middleware/auth");

router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

router.post("/login", loginUser);
router.post("/create", createUser);
router.post("/sync", syncClerkUser);
router.post("/delete", deleteUserByEmail);
router.get("/me", protectRoute, getUser);

module.exports = router;
