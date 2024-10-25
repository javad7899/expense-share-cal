const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controllers");
const auth = require("../middleware/auth"); // Import the auth middleware

router.post("/", auth, userController.createUser);
router.get("/", auth, userController.getAllUsers);
router.get("/:id", auth, userController.getUserById);
router.put("/:id", auth, userController.updateUser);
router.delete("/:id", auth, userController.deleteUser);

module.exports = router;
