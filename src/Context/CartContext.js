// context/CartContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types"; // ✅ Added

// Create the CartContext
const CartContext = createContext();

// Cart Provider to wrap the entire app or just the components that need access to cart data
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage when the component mounts
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
    console.log("Cart loaded from localStorage:", savedCart); // Debugging
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      console.log("Saving cart to localStorage:", cartItems); // Debugging
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Function to add items to the cart
  const addToCart = (item) => {
    setCartItems((prevCart) => {
      const updatedCart = [...prevCart, item];
      console.log("Adding item to cart:", item); // Debugging
      return updatedCart;
    });
  };

  // Function to remove item from the cart
  const removeFromCart = (id) => {
    setCartItems((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ✅ Added PropTypes to fix ESLint error
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Custom hook to access the cart context
export const useCart = () => useContext(CartContext);
