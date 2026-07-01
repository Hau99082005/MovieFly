const router = require("express").Router();
const multer = require("multer");
const {
  getAllVideoSources,
  getVideoSourceById,
  getVideoSourcesByMovieId,
  getVideoSourcesByEpisodeId,
  getDefaultVideoSource,
  getVideoSourcesByQuality,
  createVideoSource,
  updateVideoSource,
  deleteVideoSource,
  deleteVideoSourcesByMovieId,
  deleteVideoSourcesByEpisodeId,
} = require("../controllers/video_source");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedFormats = [
      "video/mp4",
      "video/x-matroska",
      "video/avi",
      "video/quicktime",
      "video/x-flv",
      "video/x-ms-wmv",
      "video/webm",
      "video/mpeg",
      "video/3gpp",
    ];
    if (allowedFormats.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid video format"));
    }
  },
});

router.get("/", getAllVideoSources);
router.get("/default", getDefaultVideoSource);
router.get("/quality/:quality", getVideoSourcesByQuality);
router.get("/:id", getVideoSourceById);
router.get("/movie/:movieId", getVideoSourcesByMovieId);
router.get("/episode/:episodeId", getVideoSourcesByEpisodeId);
router.post("/", upload.single("video"), createVideoSource);
router.put("/:id", upload.single("video"), updateVideoSource);
router.delete("/:id", deleteVideoSource);
router.delete("/movie/:movieId", deleteVideoSourcesByMovieId);
router.delete("/episode/:episodeId", deleteVideoSourcesByEpisodeId);

module.exports = router;
