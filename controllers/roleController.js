// controllers/roleController.js
const Role = require('../models/Role');

exports.createRole = async (req, res) => {
    try {
        const { roleName } = req.body;
        if (!roleName) {
            return res.status(400).json({ message: "Role name is required" });
        }
        const role = new Role({ roleName });
        await role.save();
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
