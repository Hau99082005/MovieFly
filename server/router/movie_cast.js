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
router.get("/:id", getMovieCastById);
router.get("/movie/:movieId", getMovieCastsByMovieId);
router.get("/person/:personId", getMovieCastsByPersonId);
router.get("/movie/:movieId/role/:role", getMovieCastsByRole);
router.post("/", createMovieCast);
router.post("/bulk", bulkCreateMovieCasts);
router.put("/:id", updateMovieCast);
router.delete("/:id", deleteMovieCast);
router.delete("/movie/:movieId", deleteMovieCastsByMovieId);

module.exports = router;
