const mongoose = require("mongoose");
const inviteSchema = new mongoose.Schema({
  teamID: { type: mongoose.Types.ObjectId, required: true },
  caller: { type: String, required: true, lowercase: true },
  requestDate: { type: Date, default: new Date() },
  // status: { type: String, default: "pending" }, // pending , accepted , rejected
  status: {
    type: String,
    enum: ["accepted", "pending", "rejected"],
    default: "pending",
  },
});
const userSchema = new mongoose.Schema(
  {
    first_name: { type: String },
    last_name: { type: String },
    username: { type: String, required: true, unique: true },
    profileImage: { type: String, default: "/defaults/default.png" },
    mobile: { type: String, required: true, unique: true },
    roles: { type: [String], default: ["USER"] },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    skills: { type: [String], default: [] },
    teams: { type: [mongoose.Types.ObjectId], default: [] },
    token: { type: String, default: "" },
    invitRequest: { type: [inviteSchema] },
  },
  {
    timestamps: true,
  }
);
const userModel = mongoose.model("user", userSchema);

module.exports = { userModel };
