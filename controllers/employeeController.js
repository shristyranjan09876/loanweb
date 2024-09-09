const Employee = require('../models/Employee');

exports.getEmployeeProfile = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(400).json({ error: 'User not authenticated' });
    }

    const employee = await Employee.findOne({ user: req.user._id }).populate('user', 'email role');
    if (!employee) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
