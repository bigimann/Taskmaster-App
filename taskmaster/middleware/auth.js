const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  // Check for the token in the 'Authorization' header
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access Denied: No Token Provided" });
  }

  try {
    // Verify the token using the JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(403).json({ message: "Invalid or Expired Token" });
  }
};

module.exports = authenticateToken;
