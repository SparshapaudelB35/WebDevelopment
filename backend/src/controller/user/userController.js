import bcrypt from "bcryptjs";
import { User } from "../../models/index.js";

/**
 *  Fetch all users
 */
const getAll = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] },
        });
        res.status(200).send({ data: users, message: "Successfully fetched users" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

const create = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).send({ message: "Invalid payload" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send({ message: "User with this email already exists" });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword, // Save hashed password
        });

        res.status(201).send({
            data: { id: newUser.id, name: newUser.name, email: newUser.email },
            message: "User successfully created",
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to create user" });
    }
};

const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        // Hash the new password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).send({ message: "User updated successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to update user" });
    }
};

/**
 *  Delete user by ID
 */
const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        await user.destroy();
        res.status(200).send({ message: "User deleted successfully" });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to delete user" });
    }
};

/**
 *  Fetch user by ID (exclude password)
 */
const getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: "User ID is required" });
        }

        const user = await User.findOne({
            where: { id },
            attributes: { exclude: ["password"] }, // Hide password
        });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({ message: "User fetched successfully", data: user });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};

export const UserController = {
    getAll,
    create,
    getById,
    deleteById,
    update,
};
