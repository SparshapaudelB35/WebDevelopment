import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function authenticateToken(req, res, next) {

  if (req.path === "/api/auth/login" || req.path.startsWith("/uploads/")) {
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
      console.error("Token verification failed:", err);
      return res.status(403).send({ message: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  });
}