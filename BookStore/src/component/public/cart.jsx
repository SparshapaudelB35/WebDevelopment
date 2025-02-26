import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMAGE_BASE_URL } from "../../constants";

function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
    updateTotal(savedCart);
  }, []);

  const updateTotal = (cartItems) => {
    const totalPrice = cartItems.reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0);
    setTotal(totalPrice.toFixed(2));
  };

  const handleRemove = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    updateTotal(updatedCart);
  };

  const handleCheckout = () => {
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";

    if (!isLoggedIn) {
      alert("You need to log in before checking out!");
      navigate("/login");
      return;
    }

    alert("Checkout successful!");
    localStorage.removeItem("cart");
    setCart([]); // Clear cart only after checkout
    setTotal(0);
    navigate("/Mainpage");
  };

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty!</p>
      ) : (
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={`${IMAGE_BASE_URL}${item.image}`} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span>{item.price}</span>
              </div>
              <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: ${total}</h3>
          </div>
          <div className="cart-actions">
            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
