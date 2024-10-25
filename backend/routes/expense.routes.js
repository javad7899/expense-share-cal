const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense.contollers");
const auth = require("../middleware/auth"); // Import the auth middleware

// Existing routes
router.post("/", auth, expenseController.createExpense);
router.get("/", auth, expenseController.getAllExpenses);
router.get("/:id", auth, expenseController.getExpenseById);
router.put("/:id", auth, expenseController.updateExpense);
router.delete("/:id", auth, expenseController.deleteExpense);

module.exports = router;
