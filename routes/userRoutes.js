const express = require("express");
const { getAllEmployees, getEmployeeProfile } = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/auth");
const router = express.Router();


router.get("/employees", protect, authorize("admin"), getAllEmployees);

router.get("/profile", protect, authorize("employee"), getEmployeeProfile);

module.exports = router;
