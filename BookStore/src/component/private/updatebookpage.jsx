import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from "../../constants";

function UpdateBookPage() {
  const { bookId } = useParams(); // Get book ID from URL
  const navigate = useNavigate();
  
  const [book, setBook] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  
  const [loading, setLoading] = useState(true);  // Initially set loading to true until data is fetched

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/product/${bookId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
    
        console.log("Fetched Book Data:", response.data); // Debugging statement
    
        if (response.data && response.data.data) {
          setBook({
            name: response.data.data.name || "", 
            description: response.data.data.description || "",
            price: response.data.data.price || "",
            image: response.data.data.image || null,
          });  // Set the fetched data to the state
        } else {
          console.error("Book not found");
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);  // Set loading to false once the data is fetched
      }
    };
    

    fetchBook();
  }, [bookId]);  // Run effect when bookId changes

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setBook((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", book.name);
    formData.append("description", book.description);
    formData.append("price", book.price);
    if (book.image) {
      formData.append("image", book.image);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${API_BASE_URL}/product/${bookId}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert("Product updated successfully!");
        navigate("/adminpage");
      }
    } catch (error) {
      console.error("Error updating book:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Current Book State:", book); // Debugging state after the fetch
  }, [book]);  // Add a side effect to monitor changes to the `book` state

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="update-book-container">
      <button className="back-btn" onClick={() => navigate("/adminpage")}>
        &larr; Back
      </button>
      <h2>Update Book</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={book.name}  // Bind the name field to the state value
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea 
            name="description" 
            value={book.description}  // Bind the description field to the state value
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input 
            type="number" 
            name="price" 
            value={book.price}  // Bind the price field to the state value
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input 
            type="file" 
            onChange={handleImageChange} 
          />
          {book.image && <p>Current image: {book.image.name}</p>}  {/* Display current image name */}
        </div>
        <button type="submit" className="update">Update Product</button>
      </form>
    </div>
  );
}

export default UpdateBookPage;
