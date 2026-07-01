const PaymentMethod = require("../models/payments_method");
const { uploadToBunny, deleteFromBunny } = require("../lib/bunnyService");

const getAllPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Payment methods retrieved successfully",
      data: paymentMethods,
      total: paymentMethods.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getActivePaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find({ is_active: true }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "Active payment methods retrieved successfully",
      data: paymentMethods,
      total: paymentMethods.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getPaymentMethodById = async (req, res) => {
  try {
    const { id } = req.params;

    const paymentMethod = await PaymentMethod.findById(id);

    if (!paymentMethod) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    return res.status(200).json({
      message: "Payment method retrieved successfully",
      data: paymentMethod,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getPaymentMethodByCode = async (req, res) => {
  try {
    const { code } = req.params;

    const paymentMethod = await PaymentMethod.findOne({ code });

    if (!paymentMethod) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    return res.status(200).json({
      message: "Payment method retrieved successfully",
      data: paymentMethod,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createPaymentMethod = async (req, res) => {
  try {
    const { code, name, is_active } = req.body;

    if (!code || !name) {
      return res.status(400).json({
        message: "Code and name are required",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Logo file is required",
      });
    }

    const existingMethod = await PaymentMethod.findOne({ code });
    if (existingMethod) {
      return res.status(400).json({
        message: "Payment method with this code already exists",
      });
    }

    const uploadResult = await uploadToBunny(
      req.file.buffer,
      req.file.originalname,
      "payment-logos",
    );

    if (!uploadResult.success) {
      return res.status(500).json({ message: "Failed to upload logo to CDN" });
    }

    const newPaymentMethod = new PaymentMethod({
      code,
      name,
      logo_url: uploadResult.cdnUrl,
      is_active: is_active !== undefined ? is_active : true,
    });

    await newPaymentMethod.save();

    return res.status(201).json({
      message: "Payment method created successfully",
      data: newPaymentMethod,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Payment method ID is required" });
    }

    const paymentMethod = await PaymentMethod.findById(id);

    if (!paymentMethod) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    const { code, name, is_active } = req.body;

    if (req.file) {
      if (paymentMethod.logo_url) {
        const oldFilePath = paymentMethod.logo_url.split(".b-cdn.net/")[1];
        if (oldFilePath) {
          await deleteFromBunny(oldFilePath).catch((err) =>
            console.log("Failed to delete old logo:", err.message),
          );
        }
      }

      const uploadResult = await uploadToBunny(
        req.file.buffer,
        req.file.originalname,
        "payment-logos",
      );

      if (!uploadResult.success) {
        return res
          .status(500)
          .json({ message: "Failed to upload logo to CDN" });
      }

      paymentMethod.logo_url = uploadResult.cdnUrl;
    }

    if (code) {
      const existingMethod = await PaymentMethod.findOne({
        code,
        _id: { $ne: id },
      });
      if (existingMethod) {
        return res.status(400).json({
          message: "Payment method with this code already exists",
        });
      }
      paymentMethod.code = code;
    }

    if (name) paymentMethod.name = name;
    if (is_active !== undefined) paymentMethod.is_active = is_active;

    await paymentMethod.save();

    return res.status(200).json({
      message: "Payment method updated successfully",
      data: paymentMethod,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Payment method ID is required" });
    }

    const paymentMethod = await PaymentMethod.findById(id);

    if (!paymentMethod) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    if (paymentMethod.logo_url) {
      const filePath = paymentMethod.logo_url.split(".b-cdn.net/")[1];
      if (filePath) {
        await deleteFromBunny(filePath).catch((err) =>
          console.log("Failed to delete logo:", err.message),
        );
      }
    }

    await PaymentMethod.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Payment method deleted successfully",
      data: paymentMethod,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllPaymentMethods,
  getActivePaymentMethods,
  getPaymentMethodById,
  getPaymentMethodByCode,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
};
