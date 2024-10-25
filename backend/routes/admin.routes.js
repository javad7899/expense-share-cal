const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../middleware/auth");

// Register a new admin
router.post("/register", adminController.register);

// Login an admin
router.post("/login", adminController.login);

// Logout an admin
router.post("/logout", adminController.logout);

// Get authenticated admin
router.get("/me", authMiddleware, adminController.getAuthAdmin);

module.exports = router;
