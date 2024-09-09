const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

router.post('/employees', authenticate, authorizeAdmin, adminController.createEmployee);
router.get('/employees', authenticate, authorizeAdmin, adminController.getAllEmployees);
router.put('/employees/:employeeId', authenticate, authorizeAdmin, adminController.updateEmployee);
router.delete('/employees/:employeeId', authenticate, authorizeAdmin, adminController.deleteEmployee);
module.exports=router;