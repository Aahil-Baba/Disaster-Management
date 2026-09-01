const Report = require("../models/Report");
const { classifyDisasterImage } = require("../services/mlService");

// Inside controllers/reportController.js

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

    // Prioritize uploaded file path, then direct JSON imageUrl, then default fallback
    let finalImageUrl = "/uploads/default-hazard.jpg";
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      finalImageUrl = imageUrl;
    }

    const report = await Report.create({
      location: {
        type: "Point",
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      },
      hazardType,
      severity,
      confidence: parseFloat(confidence),
      status: "VERIFIED",
      description: description || "",
      imageUrl: finalImageUrl,
      reporterId: req.reporterId || "anonymous-citizen",
    });

    if (req.io) {
      req.io.emit("new_disaster_report", report.toClientJSON ? report.toClientJSON() : report);
    }

    res.status(201).json({
      success: true,
      report: report.toClientJSON ? report.toClientJSON() : report,
    });
  } catch (error) {
    next(error);
  }
};
exports.getAllReports = async (req, res, next) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: reports.length,
      reports: reports.map((r) => r.toClientJSON()),
    });
  } catch (error) {
    next(error);
  }
};

exports.getReportStats = async (req, res, next) => {
  try {
    const reports = await Report.find();

    const stats = {
      total: reports.length,
      critical: reports.filter((r) => r.severity === "Critical").length,
      high: reports.filter((r) => r.severity === "High").length,
      moderate: reports.filter((r) => r.severity === "Moderate").length,
      low: reports.filter((r) => r.severity === "Low").length,
      flood: reports.filter((r) => r.hazardType === "Flood").length,
      fire: reports.filter((r) => r.hazardType === "Fire").length,
      structuralDamage: reports.filter(
        (r) => r.hazardType === "Structural Damage",
      ).length,
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};
