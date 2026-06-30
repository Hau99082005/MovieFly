const router = require("express").Router();
const {
  getAllMovieGenres,
  getMovieGenresByMovieId,
  getMovieGenresByGenreId,
  getMovieGenreById,
  createMovieGenres,
  createMultipleMovieGenres,
  updateMovieGenres,
  deleteMovieGenres,
  deleteMovieGenresByMovieId,
} = require("../controllers/moviegenres");

router.get("/", getAllMovieGenres);
router.get("/movie/:movieId", getMovieGenresByMovieId);
router.get("/genre/:genreId", getMovieGenresByGenreId);
router.get("/:id", getMovieGenreById);
router.post("/", createMovieGenres);
router.post("/bulk", createMultipleMovieGenres);
router.put("/:id", updateMovieGenres);
router.delete("/:id", deleteMovieGenres);
router.delete("/movie/:movieId", deleteMovieGenresByMovieId);

module.exports = router;
