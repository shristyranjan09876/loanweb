const express = require("express");
const { register, login } = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../middlewares/validate");
const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);

module.exports = router;
