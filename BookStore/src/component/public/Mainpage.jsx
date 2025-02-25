import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Mainpage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [filteredProducts, setFilteredProducts] = useState([]); 

  

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    setIsLoggedIn(loggedIn);

    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);

    const storedEmail = localStorage.getItem("email");
    const storedUsername = localStorage.getItem("user");
    console.log(storedUsername)

    if (storedEmail && storedUsername) {
      setUser({ email: storedEmail, name: storedUsername });
    }
    setFilteredProducts(products);
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
  }, [searchTerm]); // Runs every time the search term changes

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    console.log("clicked", showProfile)
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
  const products = [
    {
      id: 1,
      image: "/assets/atomichabit.jpg",
      name: "Atomic Habits",
      description: "A practical guide by James Clear that explores how small, consistent changes can lead to remarkable improvements in life. It provides actionable strategies for building good habits, breaking bad ones, and mastering the tiny behaviors that lead to success.",
      price: "$19.99",
    },
    {
      id: 2,
      image: "/assets/the5.jpg",
      name: "The 5 AM Club",
      description: "Robin Sharma shares a morning routine designed to maximize productivity, improve focus, and enhance personal development. This book combines storytelling with powerful insights to help readers take control of their mornings.",
      price: "$18.99",
    },
    {
      id: 3,
      image: "/assets/rich.jpg",
      name: "Rich Dad Poor Dad",
      description: "Robert Kiyosaki explains the differences in mindset between his 'rich dad' and 'poor dad,' offering financial education on how to achieve wealth and financial independence through smart investing.",
      price: "$15.99",
    },
    {
      id: 4,
      image: "/assets/thephy.jpg",
      name: "The Psychology of Money",
      description: "Morgan Housel explores timeless lessons on wealth, greed, and happiness, explaining how our behaviors and emotions impact financial success more than technical knowledge.",
      price: "$16.99",
    },
    {
      id: 5,
      image: "/assets/think.jpg",
      name: "Think and Grow Rich",
      description: "A classic by Napoleon Hill that explores the principles of success and wealth accumulation through the power of thoughts, persistence, and desire.",
      price: "$14.99",
    },
  ];

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
              value={searchTerm} // Bind the value to the searchTerm state
              onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm on change
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
                    <img src={product.image} alt={product.name} />
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
              <p>No products found for your search</p>
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
