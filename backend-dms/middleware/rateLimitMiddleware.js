const rateLimit = require("express-rate-limit");

// General API rate limiter (100 requests per 15 minutes)
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "TOO_MANY_REQUESTS",
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// Strict limiter for Auth routes (5 login/register attempts per 15 minutes)
exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "AUTH_RATE_LIMIT_EXCEEDED",
    message:
      "Too many login/registration attempts. Please try again after 15 minutes.",
  },
});

// Citizen Report submission limiter (10 reports per minute per IP to prevent spam)
exports.reportSubmissionLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "REPORT_SUBMISSION_LIMIT_EXCEEDED",
    message:
      "Too many report submissions. Please wait a minute before submitting again.",
  },
});
