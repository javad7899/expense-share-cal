const Expense = require("../models/expense.model");
const User = require("../models/user.model"); // Import the User model

exports.createExpense = async (req, res) => {
  const { amount, description, paid_by, split_between } = req.body;

  // Validation
  if (
    amount <= 0 ||
    !Array.isArray(split_between) ||
    split_between.length === 0
  ) {
    return res.status(400).send({ message: "Invalid input data" });
  }

  const splitAmount = amount / split_between.length;
  const amountPerUser = split_between.map((user) => ({
    user_id: user,
    amount: splitAmount,
  }));

  const newExpense = new Expense({
    amount,
    description,
    paid_by,
    split_between,
    amount_per_user: amountPerUser,
  });

  try {
    // Update users' totalPaid and totalReceived
    await User.updateMany(
      { _id: { $in: split_between } },
      {
        $push: {
          totalReceived: { expense_id: newExpense._id, amount: splitAmount },
        },
      }
    );

    await User.findByIdAndUpdate(paid_by, {
      $push: { totalPaid: { expense_id: newExpense._id, amount } },
    });

    const savedExpense = await newExpense.save();
    res.status(201).send(savedExpense);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate("paid_by")
      .populate("split_between.user_id");
    res.status(200).send(expenses);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate("paid_by")
      .populate("split_between.user_id");

    if (!expense) {
      return res.status(404).send({ message: "Expense not found" });
    }

    res.status(200).send(expense);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateExpense = async (req, res) => {
  const { amount, description, paid_by, split_between } = req.body;

  // Validation
  if (
    amount <= 0 ||
    !Array.isArray(split_between) ||
    split_between.length === 0
  ) {
    return res.status(400).send({ message: "Invalid input data" });
  }

  const splitAmount = amount / split_between.length;
  const amountPerUser = split_between.map((user) => ({
    user_id: user,
    amount: splitAmount,
  }));

  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        amount,
        description,
        paid_by,
        split_between,
        amount_per_user: amountPerUser,
      },
      { new: true }
    );

    // Update users' totalPaid and totalReceived for the updated expense
    await User.updateMany(
      { _id: { $in: split_between } },
      { $set: { "totalReceived.$[elem].amount": splitAmount } },
      { arrayFilters: [{ "elem.expense_id": updatedExpense._id }] }
    );

    await User.findByIdAndUpdate(
      paid_by,
      {
        $set: { "totalPaid.$[elem].amount": amount },
      },
      { arrayFilters: [{ "elem.expense_id": updatedExpense._id }] }
    );

    res.status(200).send(updatedExpense);
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).send({ message: "Expense not found" });
    }

    // Remove from users' totalPaid and totalReceived
    await User.updateMany(
      { _id: { $in: expense.split_between } },
      { $pull: { totalReceived: { expense_id: expense._id } } }
    );

    await User.findByIdAndUpdate(expense.paid_by, {
      $pull: { totalPaid: { expense_id: expense._id } },
    });

    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Expense deleted" });
  } catch (err) {
    res.status(400).send(err);
  }
};
