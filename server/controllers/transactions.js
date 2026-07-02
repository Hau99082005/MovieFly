const Transaction = require("../models/Transactions");

const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({})
      .populate("userId")
      .populate("subscriptionId")
      .populate("paymentMethodId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Transactions retrieved successfully",
      data: transactions,
      total: transactions.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
      .populate("userId")
      .populate("subscriptionId")
      .populate("paymentMethodId");

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({
      message: "Transaction retrieved successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({ userId })
      .populate("subscriptionId")
      .populate("paymentMethodId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "User transactions retrieved successfully",
      data: transactions,
      total: transactions.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getTransactionsByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    if (!["pending", "completed", "failed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be: pending, completed, or failed",
      });
    }

    const transactions = await Transaction.find({ status })
      .populate("userId")
      .populate("subscriptionId")
      .populate("paymentMethodId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: `${status.charAt(0).toUpperCase() + status.slice(1)} transactions retrieved successfully`,
      data: transactions,
      total: transactions.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getTransactionsBySubscriptionId = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const transactions = await Transaction.find({ subscriptionId })
      .populate("userId")
      .populate("paymentMethodId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Subscription transactions retrieved successfully",
      data: transactions,
      total: transactions.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getTransactionsByPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.params;

    const transactions = await Transaction.find({ paymentMethodId })
      .populate("userId")
      .populate("subscriptionId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Payment method transactions retrieved successfully",
      data: transactions,
      total: transactions.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getUserTransactionStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Transaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const totalTransactions = await Transaction.countDocuments({ userId });
    const totalSpent = await Transaction.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          status: "completed",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    return res.status(200).json({
      message: "User transaction statistics retrieved successfully",
      data: {
        stats,
        totalTransactions,
        totalSpent: totalSpent.length > 0 ? totalSpent[0].total : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createTransaction = async (req, res) => {
  try {
    const {
      userId,
      subscriptionId,
      paymentMethodId,
      amount,
      currency,
      status,
      gateway_txn_id,
      gateway_response,
      description,
      paid_at,
    } = req.body;

    if (
      !userId ||
      !subscriptionId ||
      !paymentMethodId ||
      !amount ||
      !gateway_txn_id ||
      !gateway_response ||
      !description
    ) {
      return res.status(400).json({
        message:
          "userId, subscriptionId, paymentMethodId, amount, gateway_txn_id, gateway_response, and description are required",
      });
    }

    const newTransaction = new Transaction({
      userId,
      subscriptionId,
      paymentMethodId,
      amount,
      currency: currency || "VND",
      status: status || "pending",
      gateway_txn_id,
      gateway_response,
      description,
      paid_at: status === "completed" ? paid_at || new Date() : null,
    });

    await newTransaction.save();

    const populatedTransaction = await Transaction.findById(newTransaction._id)
      .populate("userId")
      .populate("subscriptionId")
      .populate("paymentMethodId");

    return res.status(201).json({
      message: "Transaction created successfully",
      data: populatedTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, gateway_response, paid_at } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    if (!["pending", "completed", "failed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be: pending, completed, or failed",
      });
    }

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    transaction.status = status;

    if (gateway_response) {
      transaction.gateway_response = {
        ...transaction.gateway_response,
        ...gateway_response,
      };
    }

    if (status === "completed") {
      transaction.paid_at = paid_at || new Date();
    }

    await transaction.save();

    const populatedTransaction = await Transaction.findById(id)
      .populate("userId")
      .populate("subscriptionId")
      .populate("paymentMethodId");

    return res.status(200).json({
      message: "Transaction status updated successfully",
      data: populatedTransaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Transaction.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Transaction deleted successfully",
      data: transaction,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  getTransactionsByUserId,
  getTransactionsByStatus,
  getTransactionsBySubscriptionId,
  getTransactionsByPaymentMethod,
  getUserTransactionStats,
  createTransaction,
  updateTransactionStatus,
  deleteTransaction,
};
