import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Adminpage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]); // State to store fetched books

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("loggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
    const storedEmail = localStorage.getItem("email");
    const storedUsername = localStorage.getItem("user");

    if (storedEmail && storedUsername) {
      setUser({ email: storedEmail, name: storedUsername });
    }

    if (loggedInStatus) {
      fetchBooks();
    }
  }, []);

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const logout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    setUser(null);
    setShowProfile(false);
    navigate("/");
  };

  const gotouser = () => {
    navigate("/users");
  };

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/product/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && Array.isArray(response.data.data)) {
        setBooks(response.data.data);
      } else {
        console.error('Unexpected response format:', response.data);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const deleteBook = async (bookId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:4000/api/product/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        console.log(`Book with ID ${bookId} deleted successfully.`);
        // Remove the book from the state after deletion
        setBooks(books.filter(book => book.id !== bookId));
      } else {
        console.error("Failed to delete book.");
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  };

  return (
    <>
      <div className="header" style={{ position: "fixed", top: "20px", left: "200px", right: "200px", bottom: "100px" }}>
        <div className="left-section">
          <a href="Mainpage"><img className="logo" src="/assets/logo.jpg" alt="Logo"></img></a>
        </div>

        <div className="middle-section">
          <input className="search-bar" type="text" placeholder="Search" />
          <button className="search-button">
            <img className="search" src="/assets/search.jpg" alt="Search"></img>
          </button>
        </div>

        <div className="right-section">
          <button className="profile" onClick={toggleProfile}>
            Profile
            <img src="/assets/admin.jpg" className="profileimg" alt="Profile" />
          </button>
          <button className="add" onClick={() => navigate("/addbook")}>
            Add book
            <img className="cartimg" src="/assets/add.jpg" alt="Add" />
          </button>
          <button className="viewusers" onClick={gotouser}>
            View User
          </button>
        </div>
        {showProfile && user && (
          <div className={`profile-popup ${showProfile ? "show" : ""}`}>
            <div className="profile-content">
              <div className="profile-header">
                <img
                  src="/assets/profile.png"
                  alt="User Avatar"
                  className="profile-avatar"
                />
                <h2>{user.name}</h2>
                <p className="profile-email">{user.email}</p>
              </div>
              <div className="profile-actions">
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
                <button onClick={toggleProfile} className="close-btn">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="product-container">
        {books.length > 0 ? (
          books.map((book) => (
            <div className="product-card" key={book.id}>
              <div className="product-image">
                <img src={`http://localhost:4000/uploads/${book.image}`} alt={book.name || 'Book'} />
              </div>
              <div className="product-info">
                <h3>{book.name}</h3>
                <p className="product-description">{book.description || 'No description available'}</p>
                <div className="product-price">
                  <span>${book.price}</span>
                  <button className="delete-btn" onClick={() => deleteBook(book.id)}>Delete</button>
                  <button className="update-btn" onClick={() => navigate(`/updatebook/${book.id}`)}>Update</button> 
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No books available</p>
        )}
      </div>

    </>
  );
}

export default Adminpage;
