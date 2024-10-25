const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.model");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    // Check if the Authorization header is present
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    // Ensure token format is correct: 'Bearer <token>'
    const token = authHeader.replace("Bearer ", "");

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find admin by decoded token id
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Admin not found" });
    }

    req.token = token;
    req.admin = admin;
    next();
  } catch (error) {
    console.error(error); // Logs the actual error for debugging

    // Handle expired token error specifically
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = auth;
