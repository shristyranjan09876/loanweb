
const User = require('../models/User');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const mongoose=require('mongoose')

// Check user exist or not 
exports.existUser = async (query,projection) => {
    try {
        const existingUser = await User.findOne( query );
        return existingUser;
    } catch (error) {
return `could not get user ${error}`;
    }
};
// Function to find and update an employee by their ID
exports.updateEmployee = async (_id, updates,query,projection) => {
    try {
    
      const updatedEmployee = await Employee.findByIdAndUpdate(_query);

      if (!updatedEmployee) {
        return `Employee with ID ${_id} not found`;
      }

      return updatedEmployee;
    } catch (error) {
      return `Could not update employee: ${error}`;
    }
  };