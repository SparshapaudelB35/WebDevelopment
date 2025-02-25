import { Product } from "../../models/index.js";
import multer from "multer";
import path from "path";

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store images in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

/**
 * Fetch all products
 */
const getAll = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({ data: products, message: "Successfully fetched products" });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

/** 
 * Add a new product with optional image upload
 */
const add = async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // Store image path

    // Validation
    if (!name || !price || !description) {
      return res.status(400).json({ message: "Invalid payload: name, price, and description are required." });
    }

    const product = await Product.create({ name, price, description, image });
    res.status(201).json({ data: product, message: "Successfully added product" });
  } catch (e) {
    console.error("Error adding product:", e);
    res.status(500).json({ error: "Failed to add product" });
  }
};

/**
 * Update existing product with optional image update
 */
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null; // New uploaded image

    const product = await Product.findOne({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields
    await product.update({ 
      name: name || product.name, 
      price: price || product.price, 
      description: description || product.description,
      image: image || product.image // Update image if new one is uploaded
    });

    res.status(200).json({ data: product, message: "Product updated successfully" });
  } catch (e) {
    console.error("Error updating product:", e);
    res.status(500).json({ error: "Failed to update product" });
  }
};

/**
 * Delete product by ID
 */
const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (e) {
    console.error("Error deleting product:", e);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

/**
 * Fetch product by ID
 */
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id } });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ data: product, message: "Product fetched successfully" });
  } catch (e) {
    console.error("Error fetching product:", e);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

export const productController = {
  getAll,
  add,
  getById,
  deleteById,
  update,
  upload // Export Multer middleware
};
