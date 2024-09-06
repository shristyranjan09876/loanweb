const User = require("../models/User");

// Get all employees (Admin only)
exports.getAllEmployees = async (req, res) => {
  const employees = await User.find({ role: "employee" }).select("-password");
  res.json(employees);
};

// Get employee profile
exports.getEmployeeProfile = async (req, res) => {
  const employee = await User.findById(req.user._id).select("-password");
  res.json(employee);
};
