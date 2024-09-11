const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");


router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.post("/verifyOTP", authController.verifyOTP); 
router.put("/resetPassword", authController.resetPassword); 

module.exports = router;
