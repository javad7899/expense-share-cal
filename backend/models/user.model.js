const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: "Admin", required: true }, // Links user to an admin
    totalPaid: [
      {
        expense_id: { type: Schema.Types.ObjectId, ref: "Expense" },
        amount: Number,
      },
    ],
    totalReceived: [
      {
        expense_id: { type: Schema.Types.ObjectId, ref: "Expense" },
        amount: Number,
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("User", UserSchema);
