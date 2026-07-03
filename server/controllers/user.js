const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

const registerUser = async (req, res) => {
  try {
    const { username, email, password, full_name, phone, gender, birth_day } =
      req.body;

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({
        message:
          "Missing required fields: username, email, password, full_name",
      });
    }

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

    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password_hash,
      full_name,
      phone: phone || "",
      gender: gender || "other",
      birth_day: birth_day || null,
      status: "active",
      role: "user",
    });

    await newUser.save();

    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET || "moviefly-secret-key-2026",
      { expiresIn: "30d" },
    );

    const userResponse = newUser.toObject();
    delete userResponse.password_hash;

    return res.status(201).json({
      message: "Registration successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
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

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "moviefly-secret-key-2026",
      { expiresIn: "30d" },
    );

    const userResponse = user.toObject();
    delete userResponse.password_hash;

    return res.status(200).json({
      message: "Login successful",
      token,
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
      role: "user",
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
    } else {
      user = new User({
        clerkId,
        username: username || email?.split("@")[0],
        email,
        full_name: full_name || username,
        avatar_url: avatar_url || "",
        role: "user",
        status: "active",
      });
      await user.save();
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "moviefly-secret-key-2026",
      { expiresIn: "30d" }
    );

    return res.status(user.isNew ? 201 : 200).json({ 
      message: user.isNew ? "User synced successfully" : "User updated successfully", 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const getUserRole = async (req, res) => {
  try {
    const { clerkId } = req.params;

    if (!clerkId) {
      return res.status(400).json({ message: "clerkId is required" });
    }

    const user = await User.findOne({ clerkId }).select("role status");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ 
      role: user.role,
      status: user.status,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", error: error.message });
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

const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;
    
    let filter = {};
    
    if (role) {
      filter.role = role;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { full_name: { $regex: search, $options: "i" } },
      ];
    }
    
    const users = await User.find(filter)
      .select("-password_hash")
      .sort({ createdAt: -1 });
    
    return res.status(200).json({
      users,
      total: users.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!role || !["user", "admin", "moderator"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select("-password_hash");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({
      message: "User role updated successfully",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    
    if (!status || !["active", "inactive", "banned"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-password_hash");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({
      message: "User status updated successfully",
      user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
  createUser,
  syncClerkUser,
  getUserRole,
  deleteUserByEmail,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
};
