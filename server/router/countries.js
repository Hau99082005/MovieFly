const {
  getAllCountries,
  getCountryById,
  createCountries,
  updatedCountries,
  deletingCountries,
} = require("../controllers/countries");

const router = require("express").Router();
router.get("/", getAllCountries);
router.get("/:id", getCountryById);
router.post("/", createCountries);
router.put("/:id", updatedCountries);
router.delete("/:id", deletingCountries);
module.exports = router;
