const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
  },
  password: { type: String },
  role: { type: String, enum: ["admin", "employee"], default: "employee" },
  employeeProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
});

module.exports = mongoose.model("users", userSchema);
