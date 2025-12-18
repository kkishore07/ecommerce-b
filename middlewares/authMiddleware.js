const jwt = require("jsonwebtoken");

// Basic token verification
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  const bearerToken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(
      bearerToken,
      process.env.JWT_SECRET || "defaultSecretKey"
    );
    req.user = {
      id: decoded.id,
      email: decoded.email,
      isAdmin: decoded.isAdmin,
    };
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized", message: err.message });
  }
};

// User can access their own data or admin
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.userId || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Not allowed" });
    }
  });
};

// Only admin can access
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Admins only" });
    }
  });
};

// For backward compatibility (old cart.js)
const auth = verifyToken;

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  auth, // default for old imports
};
