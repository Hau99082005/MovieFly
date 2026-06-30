const router = require("express").Router();
const {
  getAllRatings,
  getRatingById,
  createRating,
  updateRating,
  deletingRating,
} = require("../controllers/rating");

router.get("/", getAllRatings);
router.get("/:id", getRatingById);
router.post("/", createRating);
router.put("/:id", updateRating);
router.delete("/:id", deletingRating);

module.exports = router;
