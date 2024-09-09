const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

exports.createEmployee = [

  // Validation checks
  check('email').isEmail(),
  check('password').isLength({ min: 6 }),
  check('firstName').not().isEmpty(),
  check('lastName').not().isEmpty(),
  check('department').not().isEmpty(),
  check('position').not().isEmpty(),
  check('salary').isNumeric(),
  check('joinDate').isDate(),
  
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, firstName, lastName, dateOfBirth, department, position, salary, joinDate } = req.body;

      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

    
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        role: 'employee',
      });
      await user.save();

  
      const employee = new Employee({
        user: user._id,
        firstName,
        lastName,
        dateOfBirth,
        department,
        position,
        salary,
        joinDate,
      });
      await employee.save();

    
      user.employeeProfile = employee._id;
      await user.save();

      res.status(201).json({ message: 'Employee created successfully', employee });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
];

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('user', 'email');
    res.json(employees);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updates = req.body;
    const employee = await Employee.findByIdAndUpdate(employeeId, updates, { new: true });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    await User.findByIdAndDelete(employee.user);
    await Employee.findByIdAndDelete(employeeId);
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
