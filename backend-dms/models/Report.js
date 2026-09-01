const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      // [longitude, latitude] format for GeoJSON
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    hazardType: {
      type: String,
      enum: ["Flood", "Fire", "Structural Damage", "Landslide", "Other", null],
      default: null,
    },
    severity: {
      type: String,
      enum: ["Low", "Moderate", "High", "Critical", null],
      default: null,
    },
    confidence: {
      type: Number,
      default: 0.0,
    },
    status: {
      type: String,
      enum: ["not_started", "in_progress", "resolved"],
      default: "not_started",
    },
    description: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      required: true,
    },
    reporterId: {
      type: String,
      default: "anonymous",
    },
  },
  { timestamps: true },
);

// Geospatial index for live mapping radius queries
reportSchema.index({ location: "2dsphere" });

// Helper to serialize response for the frontend
reportSchema.methods.toClientJSON = function () {
  return {
    _id: this._id,
    id: this._id,
    longitude: this.location.coordinates[0],
    latitude: this.location.coordinates[1],
    hazardType: this.hazardType,
    severity: this.severity,
    confidence: this.confidence,
    status: this.status,
    description: this.description,
    imageUrl: this.imageUrl,
    reporterId: this.reporterId,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
