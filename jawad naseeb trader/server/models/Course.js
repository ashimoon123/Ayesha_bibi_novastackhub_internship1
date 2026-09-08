const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  category: { type: String, required: true },
  instructor: { type: String, required: true },
  difficulty: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
  duration: { type: String, required: true },
  price: { type: Number, default: 0 },
  published: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);

