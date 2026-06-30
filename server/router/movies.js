const router = require("express").Router();
const multer = require("multer");
const {
  getAllMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movies");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "poster" || file.fieldname === "backdrop") {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Poster and backdrop must be image files"));
      }
    } else if (file.fieldname === "trailer") {
      if (file.mimetype.startsWith("video/")) {
        cb(null, true);
      } else {
        cb(new Error("Trailer must be a video file"));
      }
    } else {
      cb(null, true);
    }
  },
});

const uploadFields = upload.fields([
  { name: "poster", maxCount: 1 },
  { name: "backdrop", maxCount: 1 },
  { name: "trailer", maxCount: 1 },
]);

router.get("/", getAllMovies);
router.get("/:id", getMovieById);
router.post("/", uploadFields, createMovie);
router.put("/:id", uploadFields, updateMovie);
router.delete("/:id", deleteMovie);

module.exports = router;
