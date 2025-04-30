const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // ✅ Verify the token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Attach the decoded user data (includes userId)

    next(); // ✅ Proceed to next middleware
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }
    return res.status(400).json({ error: "Invalid token." });
  }
};