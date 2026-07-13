const router = require("express").Router();
const multer = require("multer");
const { uploadChunk, finalizeTrailerUpload } = require("../controllers/trailer");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/upload-chunk", upload.single("chunk"), uploadChunk);
router.post("/finalize", finalizeTrailerUpload);

module.exports = router;
