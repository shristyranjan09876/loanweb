const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

// Create an employee
exports.createEmployee = [
  // Validation checks
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('firstName').not().isEmpty().withMessage('First name is required'),
  check('lastName').not().isEmpty().withMessage('Last name is required'),
  check('department').not().isEmpty().withMessage('Department is required'),
  check('position').not().isEmpty().withMessage('Position is required'),
  check('salary').isNumeric().withMessage('Salary must be a number'),
  check('joinDate').isDate().withMessage('Invalid join date format'),

 

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password, firstName, lastName, dateOfBirth, department, position, salary, joinDate } = req.body;

      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Log the received password before hashing
      console.log("Received Password:", password);

      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log("🚀 ~ hashedPassword:", hashedPassword)

    

      // Create a new user with the hashed password
      const user = new User({
        email,
        password: hashedPassword,  // Store hashed password here
        role: 'employee',
      });

      await user.save();

      // Verify password is stored correctly in database by querying the user
      const savedUser = await User.findOne({ email });

      // Create a new employee profile
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

      // Link the employee profile to the user
      user.employeeProfile = employee._id;
      await user.save();

      res.status(201).json({ message: 'Employee created successfully', employee });
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ error: 'Server error' });
    }
  }
];
// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().populate('user', 'email');
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error); // Added logging for better error tracking
    res.status(400).json({ error: error.message });
  }
};

// Update an employee
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
    console.error("Error updating employee:", error); // Added logging for better error tracking
    res.status(400).json({ error: error.message });
  }
};

// Delete an employee
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
    console.error("Error deleting employee:", error); // Added logging for better error tracking
    res.status(400).json({ error: error.message });
  }
};
