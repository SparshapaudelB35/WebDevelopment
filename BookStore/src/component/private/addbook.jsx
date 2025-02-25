import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const AddBook = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    name: "",
    price: "",
    description: "",
    image: null, // Use null for file input
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setBook((prevBook) => ({
      ...prevBook,
      image: e.target.files[0], // Store file object
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!book.name || !book.price || !book.description) {
      alert("Please fill in all required fields!");
      return;
    }
  
    const formData = new FormData();
    formData.append("name", book.name);
    formData.append("price", book.price);
    formData.append("description", book.description);
    if (book.image) {
      formData.append("image", book.image);
    }
  
    try {
      // Get token from localStorage or state (wherever you're storing it)
      const token = localStorage.getItem("token"); // or from Redux store/state
  
      // Send request with Authorization header
      await axios.post("http://localhost:4000/api/product/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Include the token here
        },
      });
      alert("Book added successfully!");
      navigate("/adminpage"); // Navigate to AdminPage after adding the book
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Failed to add book.");
    }
  };
  
  

  return (
    <div className="add-book-container">
      {/* Back Button */}
      <button className="back-btn" onClick={() => navigate("/adminpage")}>
        &larr; Back
      </button>

      <div className="form-container">
        <h2>Add a New Book</h2>
        <form onSubmit={handleSubmit}>
          <label>Book Title:</label>
          <input type="text" name="name" value={book.name} onChange={handleChange} placeholder="Enter book title" required />

          <label>Price:</label>
          <input type="number" name="price" value={book.price} onChange={handleChange} placeholder="Enter price" required />

          <label>Description:</label>
          <textarea name="description" value={book.description} onChange={handleChange} placeholder="Enter description" required />

          <label>Upload Image:</label>
          <input type="file" className="file-input" accept="image/*" onChange={handleFileChange} />

          <button type="submit" className="submit-button">Add Book</button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
