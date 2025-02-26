import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL, IMAGE_BASE_URL } from "../../constants";


function Mainpage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]); // State to hold fetched products
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const storedEmail = localStorage.getItem("email");
    const storedUsername = localStorage.getItem("user");

    if (storedEmail && storedUsername) {
      setUser({ email: storedEmail, name: storedUsername });
    }

    // Fetch products from backend
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(results);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from localStorage
  
      if (!token) {
        console.error("No token found, please log in first.");
        return;
      }
  
      const response = await axios.get(`${API_BASE_URL}/product/`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add the token to the request header
        },
      });
  
      console.log("API response:", response);
  
      if (response.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      } else {
        console.error("Failed to fetch products or no data in response");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access. Please log in.");
      } else {
        console.error("Error fetching products:", error);
      }
    }
  };
  

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  const gotologin = () => {
    navigate("/login");
  };

  const gotocart = () => {
    navigate("/cart");
  };

  const addtocart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
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

  return (
    <>
      <div className="main-container">
        <header
          className="header"
          style={{
            position: "fixed",
            top: "0px",
            left: "200px",
            right: "0px",
            bottom: "0px",
          }}
        >
          <div className="left-section">
            <a href="/Mainpage">
              <img className="logo" src="/assets/logo.jpg" alt="Logo" />
            </a>
          </div>

          <div className="middle-section">
            <input
              className="search-bar"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <img className="search" src="/assets/search.jpg" alt="Search" />
            </button>
          </div>

          <div className="right-section">
            {!isLoggedIn ? (
              <button className="signreg" onClick={gotologin}>
                Sign in/Register
              </button>
            ) : (
              <button className="profile" onClick={toggleProfile}>
                Profile
                <img
                  src="/assets/profile.png"
                  className="profileimg"
                  alt="Profile"
                />
              </button>
            )}

            <button className="cart" onClick={gotocart}>
              Cart
              <img className="cartimg" src="/assets/cart.png" alt="Cart" />
            </button>
          </div>
        </header>

        <div className="content-container">
          <div className="product-container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img src={`${IMAGE_BASE_URL}${product.image}`} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-price">
                      <span>{product.price}</span>
                      <button
                        className="buy-btn"
                        onClick={() => addtocart(product)}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No Books found for your search</p>
            )}
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
      </div>
    </>
  );
}

export default Mainpage;
