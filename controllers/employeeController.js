
const Employee = require('../models/Employee');
const mongoose = require('mongoose');
exports.getEmployeeProfile = async (req, res) => {
  try {
   const employee_id=req.params._id
    const employee = await Employee.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(employee_id) } },
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
exports.UpdateProfile=async(req,res)=>{

  try {
    const { _id } = req.params; // Extract _id from the URL parameters
    const updates = req.body;

    if (!_id) {
      return res.status(400).json({ error: 'Employee ID (_id) is required for updating' });
    }

    // Find and update the employee using _id
    const employee = await Employee.findByIdAndUpdate(_id, updates, { new: true });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error("Error updating employee:", error); // Added logging for better error tracking
    res.status(400).json({ error: error.message });
  }
};







