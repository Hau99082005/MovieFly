const router = require("express").Router();
const {
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
} = require("../controllers/transactions");

router.get("/", getAllTransactions);
router.get("/status/:status", getTransactionsByStatus);
router.get("/user/:userId", getTransactionsByUserId);
router.get("/user/:userId/stats", getUserTransactionStats);
router.get("/subscription/:subscriptionId", getTransactionsBySubscriptionId);
router.get("/payment-method/:paymentMethodId", getTransactionsByPaymentMethod);
router.get("/:id", getTransactionById);
router.post("/", createTransaction);
router.patch("/:id/status", updateTransactionStatus);
router.delete("/:id", deleteTransaction);

module.exports = router;
