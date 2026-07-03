const router = require("express").Router();

const { getUser, registerUser, loginUser, createUser, syncClerkUser, getUserRole, deleteUserByEmail } = require("../controllers/user");
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.get("/test", (req, res) => {
  res.json({ message: "API is working!" });
});

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/create", createUser);
router.post("/sync", syncClerkUser);
router.get("/role/:clerkId", getUserRole);
router.delete("/delete", authMiddleware, adminMiddleware, deleteUserByEmail);
router.get("/me", authMiddleware, getUser);

module.exports = router;
