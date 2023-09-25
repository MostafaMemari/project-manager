const mongoose = require("mongoose");
const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    text: { type: String },
    image: { type: String, default: "/defaults/default.png" },
    owner: { type: mongoose.Types.ObjectId, required: true },
    team: { type: mongoose.Types.ObjectId },
    private: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);
const projectModel = mongoose.model("team", projectSchema);

module.exports = { projectModel };
