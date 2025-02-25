import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  // Skip token verification for the login route
  if (req.path === "/api/auth/login") {
    return next();
  }

  // Get token from Authorization header
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.secretkey, (err, decoded) => {
    if (err) {
      // Provide more specific error messages for debugging
      console.error("Token verification failed:", err);
      return res.status(403).send({ message: "Invalid or expired token." });
    }
    req.user = decoded; // Attach decoded payload to request object
    next(); // Proceed to the next middleware or route handler
  });
}
