const router = require("express").Router();
const { authMiddleware, adminMiddleware } = require("../middleware/auth");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/dashboard", async (req, res) => {
  try {
    return res.status(200).json({
      message: "Admin dashboard access granted",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
