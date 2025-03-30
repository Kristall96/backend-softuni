import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("Auth error:", error.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ✅ Middleware to restrict to admins only
export const isAdmin = (req, res, next) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};
