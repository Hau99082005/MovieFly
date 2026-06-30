const User = require("../models/user");
const bcrypt = require("bcryptjs");

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password_hash");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.password_hash) {
      return res.status(401).json({ message: "This account uses OAuth login" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const userResponse = user.toObject();
    delete userResponse.password_hash;

    return res.status(200).json({
      message: "Login successful",
      user: userResponse,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      clerkId,
      username,
      email,
      password,
      full_name,
      avatar_url,
      phone,
      gender,
      birth_day,
    } = req.body;

    if (!username || !email || !full_name) {
      return res.status(400).json({
        message: "Missing required fields: username, email, full_name",
      });
    }

    if (!clerkId && !password) {
      return res.status(400).json({
        message: "Either clerkId or password is required",
      });
    }

    if (password) {
      if (password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be at least 8 characters" });
      }
      if (password.length > 128) {
        return res
          .status(400)
          .json({ message: "Password must not exceed 128 characters" });
      }
      if (!/(?=.*[a-z])/.test(password)) {
        return res.status(400).json({
          message: "Password must contain at least one lowercase letter",
        });
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        return res.status(400).json({
          message: "Password must contain at least one uppercase letter",
        });
      }
      if (!/(?=.*\d)/.test(password)) {
        return res
          .status(400)
          .json({ message: "Password must contain at least one number" });
      }
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (clerkId) {
      const existingClerk = await User.findOne({ clerkId });
      if (existingClerk) {
        return res.status(400).json({ message: "Clerk user already exists" });
      }
    }

    let password_hash = undefined;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password_hash = await bcrypt.hash(password, salt);
    }

    const userData = {
      username,
      email: email.toLowerCase(),
      full_name,
      avatar_url: avatar_url || "",
      phone: phone || "",
      gender: gender || "other",
      birth_day: birth_day || null,
      status: "active",
    };

    if (clerkId) {
      userData.clerkId = clerkId;
    }

    if (password_hash) {
      userData.password_hash = password_hash;
    }

    const newUser = new User(userData);
    await newUser.save();

    const userResponse = newUser.toObject();
    delete userResponse.password_hash;

    return res.status(201).json({
      message: "User created successfully!",
      user: userResponse,
    });
  } catch (error) {
    console.error("❌ Error:", error);

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Email or clerkId already exists" });
    }
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const syncClerkUser = async (req, res) => {
  try {
    const { clerkId, username, email, full_name, avatar_url } = req.body;

    if (!clerkId) {
      return res.status(400).json({ message: "clerkId is required" });
    }

    let user = await User.findOne({ clerkId });

    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;
      user.full_name = full_name || user.full_name;
      user.avatar_url = avatar_url || user.avatar_url;
      await user.save();

      return res
        .status(200)
        .json({ message: "User updated successfully", user });
    } else {
      const newUser = new User({
        clerkId,
        username: username || email?.split("@")[0],
        email,
        full_name: full_name || username,
        avatar_url: avatar_url || "",
      });
      await newUser.save();

      return res
        .status(201)
        .json({ message: "User synced successfully", user: newUser });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const deleteUserByEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const deletedUser = await User.findOneAndDelete({
      email: email.toLowerCase(),
    });

    if (!deletedUser) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    return res.status(200).json({
      message: "User deleted successfully",
      email: deletedUser.email,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getUser,
  loginUser,
  createUser,
  syncClerkUser,
  deleteUserByEmail,
};
