const Report = require("../models/Report");
const { classifyDisasterImage } = require("../services/mlService");

// @desc    Update incident status
// @route   PATCH /api/reports/:id/status
// @access  Private / Admin
exports.updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["not_started", "in_progress", "resolved"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${allowedStatuses.join(", ")}`,
      });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true },
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    const clientReport = report.toClientJSON ? report.toClientJSON() : report;

    // Broadcast status change to admin & user map via socket
    const io = req.io || req.app.get("io");
    if (io) {
      io.emit("report_status_updated", clientReport);
    }

    return res.status(200).json({
      success: true,
      report: clientReport,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit a new disaster report
// @route   POST /api/reports/submit
// @access  Public / Authenticated
exports.submitReport = async (req, res, next) => {
  try {
    const {
      latitude,
      longitude,
      description,
      hazardType = "Flood",
      severity = "Moderate",
      confidence = 0.85,
      imageUrl,
    } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required.",
      });
    }

    let finalImageUrl = "/uploads/default-hazard.jpg";
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      finalImageUrl = imageUrl;
    }

    // Extract device ID from header or authenticated user
    const reporterId = req.user
      ? req.user._id.toString()
      : req.headers["x-device-id"] || "anonymous-citizen";

    const report = await Report.create({
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      hazardType,
      severity,
      confidence: parseFloat(confidence) || 0.85,
      status: "not_started",
      description: description || "",
      imageUrl: finalImageUrl,
      reporterId,
    });

    const clientReport = report.toClientJSON ? report.toClientJSON() : report;

    const io = req.io || req.app.get("io");
    if (io) {
      io.emit("new_disaster_report", clientReport);
    }

    return res.status(201).json({
      success: true,
      report: clientReport,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all disaster reports
// @route   GET /api/reports
// @access  Public / Authenticated
exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    const formatted = reports.map((r) =>
      r.toClientJSON ? r.toClientJSON() : r,
    );

    return res.status(200).json({
      success: true,
      count: formatted.length,
      reports: formatted,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get report dashboard metrics
// @route   GET /api/reports/stats
// @access  Public / Authenticated
exports.getReportStats = async (req, res, next) => {
  try {
    const reports = await Report.find();

    const stats = {
      total: reports.length,
      critical: reports.filter(
        (r) => (r.severity || "").toLowerCase() === "critical",
      ).length,
      high: reports.filter((r) => (r.severity || "").toLowerCase() === "high")
        .length,
      moderate: reports.filter(
        (r) => (r.severity || "").toLowerCase() === "moderate",
      ).length,
      low: reports.filter((r) => (r.severity || "").toLowerCase() === "low")
        .length,
      flood: reports.filter(
        (r) => (r.hazardType || "").toLowerCase() === "flood",
      ).length,
      fire: reports.filter((r) => (r.hazardType || "").toLowerCase() === "fire")
        .length,
      structuralDamage: reports.filter(
        (r) => (r.hazardType || "").toLowerCase() === "structural damage",
      ).length,
    };

    return res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};
