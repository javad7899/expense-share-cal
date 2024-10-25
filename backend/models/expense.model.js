const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AmountPerUserSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
});

const ExpenseSchema = new Schema(
  {
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    paid_by: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user who paid
    split_between: [
      { type: Schema.Types.ObjectId, ref: "User", required: true },
    ], // Array of users who will share the expense
    amount_per_user: [AmountPerUserSchema], // Array containing how much each user owes
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("Expense", ExpenseSchema);
