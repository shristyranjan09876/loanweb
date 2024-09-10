
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
      // { $unwind: { path: '$userDetails', preserveNullAndEmptyArrays: true } },
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
