const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { citizenSession } = require("../middleware/authMiddleware");
const {
  reportSubmissionLimiter,
} = require("../middleware/rateLimitMiddleware");
const {
  submitReport,
  getAllReports,
  getReportStats,
} = require("../controllers/reportController");
router.post(
  "/submit",
  reportSubmissionLimiter,
  citizenSession,
  upload.single("image"),
  submitReport,
);
router.get("/stats", getReportStats);
router.get("/", getAllReports);

module.exports = router;
