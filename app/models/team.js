const mongoose = require("mongoose");
const teamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    users: { type: [mongoose.Types.ObjectId], default: [] },
    owner: { type: mongoose.Types.ObjectId, required: true },
    username: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);
const teamModel = mongoose.model("team", teamSchema);

module.exports = { teamModel };
