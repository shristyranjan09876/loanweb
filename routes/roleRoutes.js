const express = require("express");
const { createRole, getRoles } = require("../controllers/roleController");
const router = express.Router();

router.post("/", createRole); // Route to create a role
router.get("/", getRoles); // Route to get all roles

module.exports = router;
