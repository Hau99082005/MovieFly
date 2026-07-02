const router = require("express").Router();
const {
  getAllMovieCasts,
  getMovieCastById,
  getMovieCastsByMovieId,
  getMovieCastsByPersonId,
  getMovieCastsByRole,
  createMovieCast,
  bulkCreateMovieCasts,
  updateMovieCast,
  deleteMovieCast,
  deleteMovieCastsByMovieId,
} = require("../controllers/movie_cast");

router.get("/", getAllMovieCasts);
router.get("/movie/:movieId/role/:role", getMovieCastsByRole);
router.get("/movie/:movieId", getMovieCastsByMovieId);
router.get("/person/:personId", getMovieCastsByPersonId);
router.get("/:id", getMovieCastById);
router.post("/bulk", bulkCreateMovieCasts);
router.post("/", createMovieCast);
router.put("/:id", updateMovieCast);
router.delete("/movie/:movieId", deleteMovieCastsByMovieId);
router.delete("/:id", deleteMovieCast);

module.exports = router;
