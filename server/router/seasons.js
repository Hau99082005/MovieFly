const router = require("express").Router();
const multer = require("multer");
const {
  getAllSeasons,
  getSeasonsByMovieId,
  getSeasonById,
  createSeason,
  updateSeason,
  deleteSeason,
  deleteSeasonsByMovieId,
} = require("../controllers/Seasons");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.get("/", getAllSeasons);
router.get("/movie/:movieId", getSeasonsByMovieId);
router.get("/:id", getSeasonById);
router.post("/", upload.single("poster"), createSeason);
router.put("/:id", upload.single("poster"), updateSeason);
router.delete("/:id", deleteSeason);
router.delete("/movie/:movieId", deleteSeasonsByMovieId);

module.exports = router;
