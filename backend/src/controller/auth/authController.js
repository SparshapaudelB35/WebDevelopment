import bcrypt from "bcryptjs";
import { User } from "../../models/index.js";
import { generateToken } from "../../security/jwt-util.js";

const ROLE = {
  ADMIN: "admin",
  USER: "user",
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Assign role explicitly based on email
    const role = email === "admin@admin.com" ? ROLE.ADMIN : ROLE.USER;

    // Log the role before generating the token to verify
    console.log("Assigned Role for email:", email, "Role:", role);

    // Generate JWT
    const token = generateToken({ user: user.toJSON(), role });

    // Log the token to check its contents
    console.log("Generated Token:", token);

    // Response
    return res.status(200).json({
      message: "Successfully logged in",
      data: {
        token,
        role,
        user: { id: user.id, name: user.name, email: user.email },
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Failed to login" });
  }
};

export const authController = {
  login,
};
