const Countries = require("../models/countries");

const getAllCountries = async (req, res) => {
  try {
    const countries = await Countries.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Countries retrieved successfully",
      data: countries,
      total: countries.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getCountryById = async (req, res) => {
  try {
    const { id } = req.params;

    const country = await Countries.findById(id);

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    return res.status(200).json({
      message: "Country retrieved successfully",
      data: country,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createCountries = async (req, res) => {
  try {
    const { code, name } = req.body;

    if (!code || !name) {
      return res.status(400).json({ message: "code and name are required" });
    }

    const existingCountry = await Countries.findOne({
      $or: [{ code }, { name }],
    });

    if (existingCountry) {
      return res.status(409).json({
        message: "Country with the same code or name already exists",
      });
    }

    const newCountry = new Countries({ code, name });
    await newCountry.save();

    return res.status(201).json({
      message: "Country created successfully",
      data: newCountry,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updatedCountries = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Country ID is required" });
    }

    const country = await Countries.findById(id);

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    const { code, name } = req.body;

    const updateData = {};

    if (code) updateData.code = code;
    if (name) updateData.name = name;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    if (code || name) {
      const existingCountry = await Countries.findOne({
        $or: [code ? { code } : null, name ? { name } : null].filter(Boolean),
        _id: { $ne: id },
      });

      if (existingCountry) {
        return res.status(409).json({
          message: "Country with the same code or name already exists",
        });
      }
    }

    const updatedCountry = await Countries.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      message: "Country updated successfully",
      data: updatedCountry,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deletingCountries = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Country ID is required" });
    }

    const deletedCountry = await Countries.findByIdAndDelete(id);

    if (!deletedCountry) {
      return res.status(404).json({ message: "Country not found" });
    }

    return res.status(200).json({
      message: "Country deleted successfully",
      data: deletedCountry,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllCountries,
  getCountryById,
  createCountries,
  updatedCountries,
  deletingCountries,
};
