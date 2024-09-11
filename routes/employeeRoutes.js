const express = require('express');
const router = express.Router();
const { authenticate, authorizeEmployee } = require('../middlewares/auth');
const employeeController = require('../controllers/employeeController');

router.get('/profile/:_id', authenticate, authorizeEmployee, employeeController.getEmployeeProfile);
router.put('/employees/:_id', authenticate, authorizeEmployee, employeeController.UpdateProfile);
module.exports = router;
