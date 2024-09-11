
const Employee = require('../models/Employee');
const mongoose = require('mongoose');


exports.getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.user._id;  
    console.log("User ID from token:", userId);

    const employee = await Employee.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },  // Match the user ID from token
      {
        $lookup: {
          from: 'users', // The name of the User collection
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          dateOfBirth: 1,
          department: 1,
          position: 1,
          salary: 1,
          joinDate: 1,
          documents: 1,
          employeeId: 1,
          'userDetails.email': 1,
          'userDetails.role': 1
        }
      }
    ]);

    if (employee.length === 0) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    res.json(employee[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.UpdateProfile = async (req, res) => {
  try {
    const userId = req.user._id;  // Extract user ID from token
    const updates = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find and update the employee using the user ID from the token
    const employee = await Employee.findOneAndUpdate(
      { user: userId },  // Match the employee by user ID from the token
      updates,
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);  // Added logging for better error tracking
    res.status(400).json({ error: error.message });
  }
};






