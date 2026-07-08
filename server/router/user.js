const router = require("express").Router();

const {
  getUser,
  registerUser,
  loginUser,
  createUser,
  syncClerkUser,
  getUserRole,
  deleteUserByEmail,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} = require("../controllers/user");
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
router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.put("/:userId/role", authMiddleware, adminMiddleware, updateUserRole);
router.put(
  "/:userId/status",
  authMiddleware,
  adminMiddleware,
  updateUserStatus,
);
router.delete("/:userId", authMiddleware, adminMiddleware, deleteUser);

module.exports = router;
