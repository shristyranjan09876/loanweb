const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

router.post('/employees', authenticate, authorizeAdmin, adminController.createEmployee);
router.get('/employees', authenticate, authorizeAdmin, adminController.getAllEmployees);
router.put('/employees/:_id', authenticate, authorizeAdmin, adminController.updateEmployee);
router.delete('/employees/:_id', authenticate, authorizeAdmin, adminController.deleteEmployee);

router.get('/employee/:_id',authenticate,authorizeAdmin,adminController.getEmployeeProfile);
router.post('/interests',authenticate,authorizeAdmin, adminController.createInterest);


router.get('/interests',authenticate,authorizeAdmin, adminController.getAllInterests);

module.exports=router;