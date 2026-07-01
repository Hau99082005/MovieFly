const UserSubscription = require("../models/user_subscriptions");
const SubscriptionPlan = require("../models/subscription_plans");

const getAllUserSubscriptions = async (req, res) => {
  try {
    const subscriptions = await UserSubscription.find({})
      .populate("userId")
      .populate("planId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "User subscriptions retrieved successfully",
      data: subscriptions,
      total: subscriptions.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getUserSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const subscription = await UserSubscription.findById(id)
      .populate("userId")
      .populate("planId");

    if (!subscription) {
      return res.status(404).json({ message: "User subscription not found" });
    }

    return res.status(200).json({
      message: "User subscription retrieved successfully",
      data: subscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getUserSubscriptionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const subscriptions = await UserSubscription.find({ userId })
      .populate("planId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "User subscriptions retrieved successfully",
      data: subscriptions,
      total: subscriptions.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const getActiveUserSubscription = async (req, res) => {
  try {
    const { userId } = req.params;

    const activeSubscription = await UserSubscription.findOne({
      userId,
      status: "active",
      expires_at: { $gt: new Date() },
    })
      .populate("planId")
      .sort({ expires_at: -1 });

    if (!activeSubscription) {
      return res.status(404).json({
        message: "No active subscription found for this user",
      });
    }

    return res.status(200).json({
      message: "Active subscription retrieved successfully",
      data: activeSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const createUserSubscription = async (req, res) => {
  try {
    const { userId, planId, autoRenew } = req.body;

    if (!userId || !planId) {
      return res.status(400).json({
        message: "userId and planId are required",
      });
    }

    const plan = await SubscriptionPlan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    if (!plan.is_active) {
      return res.status(400).json({
        message: "This subscription plan is not available",
      });
    }

    const existingActive = await UserSubscription.findOne({
      userId,
      status: "active",
      expires_at: { $gt: new Date() },
    });

    if (existingActive) {
      return res.status(409).json({
        message: "User already has an active subscription",
      });
    }

    const startDate = new Date();
    const expiresAt = new Date(startDate);
    expiresAt.setDate(expiresAt.getDate() + plan.duration_days);

    const newSubscription = new UserSubscription({
      userId,
      planId,
      status: "active",
      startDate_at: startDate,
      expires_at: expiresAt,
      autoRenew: autoRenew !== undefined ? autoRenew : true,
    });

    await newSubscription.save();

    const populatedSubscription = await UserSubscription.findById(
      newSubscription._id,
    )
      .populate("userId")
      .populate("planId");

    return res.status(201).json({
      message: "User subscription created successfully",
      data: populatedSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const updateUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "User subscription ID is required" });
    }

    const subscription = await UserSubscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: "User subscription not found" });
    }

    const { status, autoRenew, expires_at } = req.body;

    if (status) {
      if (!["active", "inactive", "canceled", "expired"].includes(status)) {
        return res.status(400).json({
          message:
            "Invalid status. Must be: active, inactive, canceled, or expired",
        });
      }
      subscription.status = status;
    }

    if (autoRenew !== undefined) {
      subscription.autoRenew = autoRenew;
    }

    if (expires_at) {
      const newExpiresAt = new Date(expires_at);
      if (isNaN(newExpiresAt.getTime())) {
        return res.status(400).json({ message: "Invalid expires_at date" });
      }
      subscription.expires_at = newExpiresAt;
    }

    await subscription.save();

    const populatedSubscription = await UserSubscription.findById(id)
      .populate("userId")
      .populate("planId");

    return res.status(200).json({
      message: "User subscription updated successfully",
      data: populatedSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const renewUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "User subscription ID is required" });
    }

    const subscription = await UserSubscription.findById(id).populate("planId");

    if (!subscription) {
      return res.status(404).json({ message: "User subscription not found" });
    }

    if (!subscription.planId) {
      return res.status(404).json({ message: "Subscription plan not found" });
    }

    const plan = subscription.planId;

    const newStartDate = new Date();
    const newExpiresAt = new Date(newStartDate);
    newExpiresAt.setDate(newExpiresAt.getDate() + plan.duration_days);

    subscription.status = "active";
    subscription.startDate_at = newStartDate;
    subscription.expires_at = newExpiresAt;

    await subscription.save();

    const populatedSubscription = await UserSubscription.findById(id)
      .populate("userId")
      .populate("planId");

    return res.status(200).json({
      message: "User subscription renewed successfully",
      data: populatedSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const cancelUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "User subscription ID is required" });
    }

    const subscription = await UserSubscription.findById(id);

    if (!subscription) {
      return res.status(404).json({ message: "User subscription not found" });
    }

    subscription.status = "canceled";
    subscription.autoRenew = false;

    await subscription.save();

    const populatedSubscription = await UserSubscription.findById(id)
      .populate("userId")
      .populate("planId");

    return res.status(200).json({
      message: "User subscription canceled successfully",
      data: populatedSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteUserSubscription = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(400)
        .json({ message: "User subscription ID is required" });
    }

    const deletedSubscription = await UserSubscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      return res.status(404).json({ message: "User subscription not found" });
    }

    return res.status(200).json({
      message: "User subscription deleted successfully",
      data: deletedSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

const checkSubscriptionExpiry = async (req, res) => {
  try {
    const expiredSubscriptions = await UserSubscription.find({
      status: "active",
      expires_at: { $lte: new Date() },
    });

    for (const subscription of expiredSubscriptions) {
      subscription.status = "expired";
      await subscription.save();
    }

    return res.status(200).json({
      message: "Subscription expiry check completed",
      expiredCount: expiredSubscriptions.length,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  getAllUserSubscriptions,
  getUserSubscriptionById,
  getUserSubscriptionsByUserId,
  getActiveUserSubscription,
  createUserSubscription,
  updateUserSubscription,
  renewUserSubscription,
  cancelUserSubscription,
  deleteUserSubscription,
  checkSubscriptionExpiry,
};
