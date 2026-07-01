const router = require("express").Router();
const multer = require("multer");
const {
  getAllEpisodes,
  getEpisodesBySeasonId,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  deleteEpisodesBySeasonId,
  incrementViewCount,
} = require("../controllers/episodes");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "thumbnail") {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Thumbnail must be an image file"));
      }
    } else if (file.fieldname === "video") {
      if (file.mimetype.startsWith("video/")) {
        cb(null, true);
      } else {
        cb(new Error("Video must be a video file"));
      }
    } else {
      cb(null, true);
    }
  },
});

const uploadFields = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

router.get("/", getAllEpisodes);
router.get("/season/:seasonId", getEpisodesBySeasonId);
router.get("/:id", getEpisodeById);
router.post("/", uploadFields, createEpisode);
router.put("/:id", uploadFields, updateEpisode);
router.patch("/:id/view", incrementViewCount);
router.delete("/:id", deleteEpisode);
router.delete("/season/:seasonId", deleteEpisodesBySeasonId);

module.exports = router;
