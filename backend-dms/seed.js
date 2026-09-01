// Run via: node seed.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Report = require("./models/Report");

dotenv.config();

const sampleReports = [
  {
    location: { type: "Point", coordinates: [80.1709, 13.0827] },
    hazardType: "Flood",
    severity: "High",
    confidence: 0.91,
    status: "VERIFIED",
    description: "Severe waterlogging blocking traffic on main corridor",
    imageUrl: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600",
  },
  {
    location: { type: "Point", coordinates: [80.2014, 13.0418] },
    hazardType: "Structural Damage",
    severity: "Critical",
    confidence: 0.88,
    status: "VERIFIED",
    description: "Collapsed wall and damaged storefront following tremors",
    imageUrl:
      "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=600",
  },
  {
    location: { type: "Point", coordinates: [80.2205, 12.9815] },
    hazardType: "Fire",
    severity: "Moderate",
    confidence: 0.84,
    status: "VERIFIED",
    description: "Electrical transformer fire near residential zone",
    imageUrl:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Report.deleteMany({});
  await Report.insertMany(sampleReports);
  console.log("✅ Seeded sample disaster hazards successfully");
  process.exit();
}
seed();
