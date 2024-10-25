require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const expenseRoutes = require("./routes/expense.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes"); // Add the admin routes

app.use("/api/expenses", expenseRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes); // Use the admin routes

app.get("/api", (req, res) => {
  res.send("Expense Sharing Calculator API");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
