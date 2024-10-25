const User = require("../models/user.model");

// Create a new user
exports.createUser = async (req, res) => {
  const { username, fullname } = req.body;

  // Validate input
  if (!username || !fullname) {
    return res.status(400).send({ message: "All fields are required." });
  }

  // Create a new user instance with the associated admin
  const newUser = new User({
    username,
    fullname,
    admin: req.admin._id, // Associate the user with the authenticated admin
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).send(savedUser);
  } catch (err) {
    res.status(400).send({ message: "Error creating user", error: err });
  }
};

// Get all users for the authenticated admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ admin: req.admin._id }); // Filter by admin
    res.status(200).send(users);
  } catch (err) {
    res.status(400).send({ message: "Error fetching users", error: err });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
      admin: req.admin._id,
    }); // Ensure user belongs to the admin
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({ message: "Error fetching user", error: err });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, admin: req.admin._id }, // Ensure the user belongs to the admin
      req.body,
      { new: true }
    );
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(400).send({ message: "Error updating user", error: err });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      admin: req.admin._id,
    }); // Ensure the user belongs to the admin
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.status(200).send({ message: "User deleted" });
  } catch (err) {
    res.status(400).send({ message: "Error deleting user", error: err });
  }
};
