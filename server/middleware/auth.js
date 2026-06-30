const User = require("../models/user");
const { clerkClient } = require("@clerk/express");

const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - no token" });
    }

    const token = authHeader.split("Bearer ")[1];

    const sessionClaims = await clerkClient.verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const clerkId = sessionClaims.sub;

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    req.userId = user._id.toString();
    req.clerkId = clerkId;

    next();
  } catch (error) {
    if (error.message?.includes("token")) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = { protectRoute };
