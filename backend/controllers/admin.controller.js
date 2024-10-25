const Admin = require("../models/admin.model");
const jwt = require("jsonwebtoken");

// Register a new admin (optional if needed)
exports.register = async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).send(admin);
  } catch (error) {
    res.status(400).send({ message: "Error creating admin" });
  }
};

// Login admin
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate the token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send the token back to the client
    res.json({ token });
  } catch (error) {
    res.status(500).send({ message: "Error logging in" });
  }
};

// Logout admin (optional for this example, token revocation could be handled here)
exports.logout = async (req, res) => {
  try {
    // Token invalidation can be done by removing it from the client's storage
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error logging out" });
  }
};

// Get authenticated admin
exports.getAuthAdmin = async (req, res) => {
  try {
    res.json(req.admin); // Return the authenticated admin from the middleware
  } catch (error) {
    res.status(500).send({ message: "Error fetching admin" });
  }
};
