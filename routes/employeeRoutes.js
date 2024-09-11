const express = require('express');
const router = express.Router();
const { authenticate, authorizeEmployee } = require('../middlewares/auth');
const employeeController = require('../controllers/employeeController');

router.get('/profile/', authenticate, authorizeEmployee, employeeController.getEmployeeProfile);
router.put('/employees/', authenticate, authorizeEmployee, employeeController.UpdateProfile);
module.exports = router;
