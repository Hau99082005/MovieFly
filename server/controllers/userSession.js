const UserSession = require("../models/user_session");

const getUserSessions = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required" });
    }

    const sessions = await UserSession.find({ userId });

    if (sessions.length === 0) {
      return res.status(404).json({ message: "No sessions found for this user" });
    }

    const sessionsData = sessions.map((session) => ({
      id: session._id,
      token: session.token,
      deviceType: session.deviceType,
      deviceName: session.deviceName,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }));

    return res.status(200).json({ sessions: sessionsData, total: sessionsData.length });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving user sessions",
      error: error.message,
    });
  }
};

const createUserSession = async (req, res) => {
  try {
    const { userId, token, deviceType, deviceName, ipAddress, userAgent, expiresAt } = req.body;

    if (!userId || !token || !deviceType) {
      return res.status(400).json({ message: "userId, token, and deviceType are required" });
    }

    const newSession = new UserSession({
      userId,
      token,
      deviceType,
      deviceName: deviceName || "Unknown",
      ipAddress: ipAddress || "",
      userAgent: userAgent || "",
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    const savedSession = await newSession.save();

    return res.status(201).json({
      message: "User session created successfully",
      session: savedSession,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating user session",
      error: error.message,
    });
  }
};

const updateUserSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { token, deviceType, deviceName, ipAddress, userAgent, expiresAt } = req.body;

    const updateData = {};
    if (token) updateData.token = token;
    if (deviceType) updateData.deviceType = deviceType;
    if (deviceName) updateData.deviceName = deviceName;
    if (ipAddress) updateData.ipAddress = ipAddress;
    if (userAgent) updateData.userAgent = userAgent;
    if (expiresAt) updateData.expiresAt = expiresAt;

    const updatedSession = await UserSession.findByIdAndUpdate(
      sessionId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ message: "User session not found" });
    }

    return res.status(200).json({
      message: "User session updated successfully",
      session: updatedSession,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating user session",
      error: error.message,
    });
  }
};

const deleteUserSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const deletedSession = await UserSession.findByIdAndDelete(sessionId);

    if (!deletedSession) {
      return res.status(404).json({ message: "User session not found" });
    }

    return res.status(200).json({ message: "User session deleted successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting user session",
      error: error.message,
    });
  }
};

const deleteExpiredSessions = async (req, res) => {
  try {
    const result = await UserSession.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    return res.status(200).json({
      message: "Expired sessions deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting expired sessions",
      error: error.message,
    });
  }
};

module.exports = {
  getUserSessions,
  createUserSession,
  updateUserSession,
  deleteUserSession,
  deleteExpiredSessions,
};
