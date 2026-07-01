const router = require("express").Router();
const multer = require("multer");
const {
  getAllSubtitles,
  getSubtitleById,
  getSubtitlesByMovieId,
  getSubtitlesByEpisodeId,
  createSubtitle,
  updateSubtitle,
  deleteSubtitle,
  deleteSubtitlesByEpisodeId,
} = require("../controllers/subtitles");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["text/plain", "text/vtt", "application/x-subrip"];
    const allowedExts = [".srt", ".vtt"];
    const ext = file.originalname.toLowerCase().slice(-4);

    if (allowedMimes.includes(file.mimetype) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Only .srt and .vtt subtitle files are allowed"));
    }
  },
});

router.get("/", getAllSubtitles);
router.get("/:id", getSubtitleById);
router.get("/movie/:movieId", getSubtitlesByMovieId);
router.get("/episode/:episodeId", getSubtitlesByEpisodeId);
router.post("/", upload.single("subtitle"), createSubtitle);
router.put("/:id", upload.single("subtitle"), updateSubtitle);
router.delete("/:id", deleteSubtitle);
router.delete("/episode/:episodeId", deleteSubtitlesByEpisodeId);

module.exports = router;
