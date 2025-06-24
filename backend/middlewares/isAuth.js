const jwt = require("jsonwebtoken");
const User = require("../model/User"); // ✅ Import your User model

const isAuthenticated = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ✅ Decode token
    const decoded = jwt.verify(token, "nazaKey");

    // ✅ Fetch full user from DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Attach full user to request
    req.user = user;

    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};

module.exports = isAuthenticated;
