const router = require("express").Router();
const multer = require("multer");
const {
  getAllPeople,
  getPersonById,
  getPersonBySlug,
  createPeople,
  updatePeople,
  deletePeople,
} = require("../controllers/people");

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

router.get("/", getAllPeople);
router.get("/id/:id", getPersonById);
router.get("/slug/:slug", getPersonBySlug);
router.post("/", upload.single("avatar"), createPeople);
router.put("/:id", upload.single("avatar"), updatePeople);
router.delete("/:id", deletePeople);

module.exports = router;
