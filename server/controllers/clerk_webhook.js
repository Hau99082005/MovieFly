const User = require("../models/user");
const bcrypt = require("bcryptjs");

const handleClerkWebhook = async (req, res) => {
  try {
    const { type, data } = req.body;

    console.log("🔔 Clerk Webhook:", type);

    switch (type) {
      case "user.created":
        await handleUserCreated(data);
        break;
      case "user.updated":
        await handleUserUpdated(data);
        break;
      case "user.deleted":
        await handleUserDeleted(data);
        break;
      default:
        console.log("⚠️ Unhandled webhook type:", type);
    }

    return res.status(200).json({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return res.status(500).json({ message: "Webhook processing failed", error: error.message });
  }
};

const handleUserCreated = async (clerkUser) => {
  try {
    const existingUser = await User.findOne({ clerkId: clerkUser.id });
    
    if (existingUser) {
      console.log("⚠️ User already exists:", clerkUser.id);
      return;
    }

    const email = clerkUser.email_addresses?.[0]?.email_address;
    const username = clerkUser.username || email?.split("@")[0] || `user_${clerkUser.id.substring(0, 8)}`;
    const full_name = `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim() || username;

    const hasPassword = clerkUser.password_enabled === true;
    let password_hash = undefined;

    if (hasPassword && clerkUser.password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(clerkUser.password, salt);
    }

    const newUser = new User({
      clerkId: clerkUser.id,
      username,
      email,
      full_name,
      avatar_url: clerkUser.image_url || "",
      phone: clerkUser.phone_numbers?.[0]?.phone_number || "",
      gender: "other",
      status: "active",
      role: "user",
      password_hash,
      email_verified_at: clerkUser.email_addresses?.[0]?.verification?.status === "verified" ? new Date() : null,
    });

    await newUser.save();
    console.log("✅ User synced to MongoDB:", newUser.email);
  } catch (error) {
    console.error("❌ Error creating user:", error);
    throw error;
  }
};

const handleUserUpdated = async (clerkUser) => {
  try {
    const user = await User.findOne({ clerkId: clerkUser.id });
    
    if (!user) {
      console.log("⚠️ User not found, creating new:", clerkUser.id);
      await handleUserCreated(clerkUser);
      return;
    }

    const email = clerkUser.email_addresses?.[0]?.email_address;
    const username = clerkUser.username || email?.split("@")[0] || user.username;
    const full_name = `${clerkUser.first_name || ""} ${clerkUser.last_name || ""}`.trim() || user.full_name;

    user.username = username;
    user.email = email || user.email;
    user.full_name = full_name;
    user.avatar_url = clerkUser.image_url || user.avatar_url;
    user.phone = clerkUser.phone_numbers?.[0]?.phone_number || user.phone;
    
    if (clerkUser.email_addresses?.[0]?.verification?.status === "verified") {
      user.email_verified_at = new Date();
    }

    await user.save();
    console.log("✅ User updated in MongoDB:", user.email);
  } catch (error) {
    console.error("❌ Error updating user:", error);
    throw error;
  }
};

const handleUserDeleted = async (clerkUser) => {
  try {
    const deletedUser = await User.findOneAndDelete({ clerkId: clerkUser.id });
    
    if (deletedUser) {
      console.log("✅ User deleted from MongoDB:", deletedUser.email);
    } else {
      console.log("⚠️ User not found for deletion:", clerkUser.id);
    }
  } catch (error) {
    console.error("❌ Error deleting user:", error);
    throw error;
  }
};

module.exports = {
  handleClerkWebhook,
};
