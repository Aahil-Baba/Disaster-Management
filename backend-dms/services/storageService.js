const path = require("path");
const fs = require("fs");

/**
 * Returns accessible URL for local disk uploads
 * @param {string} filename
 * @returns {string} Relative URL path
 */
exports.getLocalImageUrl = (filename) => {
  return `/uploads/${filename}`;
};

/**
 * Deletes a temporary file from disk
 * @param {string} filePath
 */
exports.deleteLocalFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Failed to delete local file: ${filePath}`, err);
    });
  }
};

/**
 * Optional Cloudinary Uploader (if cloud storage is preferred)
 */
exports.uploadToCloudinary = async (filePath) => {
  try {
    const cloudinary = require("../config/cloudinary");
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "disaster_hazards",
    });
    return result.secure_url;
  } catch (err) {
    console.warn(
      "⚠️ Cloudinary not configured or failed, using local storage path.",
    );
    return null;
  }
};
