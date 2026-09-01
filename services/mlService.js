const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

const ML_API_URL =
  process.env.ML_SERVICE_URL ||
  "https://balance-possible-silicon.ngrok-free.dev/predict";

/**
 * Normalizes hazard labels coming from the ML service
 */
function normalizeHazard(hazard) {
  if (!hazard) return "Flood";
  const cleaned = hazard.replace(/_/g, " ").trim();
  if (/structural\s*damage/i.test(cleaned)) return "Structural Damage";
  if (/fire/i.test(cleaned)) return "Fire";
  if (/flood/i.test(cleaned)) return "Flood";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

/**
 * Sends image file stream to the ML endpoint
 * @param {string} imagePath - Local multer file path
 * @returns {Promise<{ hazardType: string, severity: string, confidence: number }>}
 */
exports.classifyDisasterImage = async (imagePath) => {
  try {
    const form = new FormData();
    // Teammate's expected field name: "image"
    form.append("image", fs.createReadStream(imagePath));

    const response = await axios.post(ML_API_URL, form, {
      headers: {
        ...form.getHeaders(),
        "ngrok-skip-browser-warning": "true",
      },
      timeout: 20000,
    });

    const data = response.data;

    if (data && data.success) {
      return {
        hazardType: normalizeHazard(data.hazard),
        severity: data.severity || "Moderate",
        confidence:
          typeof data.confidence === "number"
            ? parseFloat(data.confidence.toFixed(4))
            : 0.85,
      };
    }

    throw new Error("Invalid response schema from ML API");
  } catch (error) {
    console.warn(
      "⚠️ ML service error or ngrok offline. Using fallback defaults:",
      error.message,
    );
    return {
      hazardType: "Flood",
      severity: "Moderate",
      confidence: 0.8,
    };
  }
};
