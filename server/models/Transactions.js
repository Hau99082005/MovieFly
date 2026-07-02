const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserSubscription",
      required: true,
    },
    paymentMethodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "VND",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    gateway_txn_id: {
      type: String,
      required: true,
    },
    gateway_response: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    paid_at: {
      type: Date,
      default: null,
      required: false,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
