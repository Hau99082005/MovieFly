const router = require("express").Router();
const multer = require("multer");
const {
  getAllPaymentMethods,
  getActivePaymentMethods,
  getPaymentMethodById,
  getPaymentMethodByCode,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} = require("../controllers/payments_method");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

router.get("/", getAllPaymentMethods);
router.get("/active", getActivePaymentMethods);
router.get("/id/:id", getPaymentMethodById);
router.get("/code/:code", getPaymentMethodByCode);
router.post("/", upload.single("logo"), createPaymentMethod);
router.put("/:id", upload.single("logo"), updatePaymentMethod);
router.delete("/:id", deletePaymentMethod);

module.exports = router;
