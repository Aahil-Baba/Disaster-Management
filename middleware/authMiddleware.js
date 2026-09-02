const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
// Protect authenticated routes (Users / Admins)
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "NOT_AUTHORIZED",
      message: "Access denied. No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "disaster_secret_key",
    );
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User no longer exists." });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "INVALID_TOKEN",
      message: "Token verification failed.",
    });
  }
};

// Admin-only guard
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: "FORBIDDEN",
    message: "Admin privileges required for this action.",
  });
};

// Citizen anonymous session fallback for instant reporting
exports.citizenSession = (req, res, next) => {
  const deviceId = req.headers["x-device-id"] || req.ip || "anonymous-reporter";
  req.reporterId = deviceId;
  next();
};
