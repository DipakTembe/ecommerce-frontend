import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Use backend URL from env for fallback image
  const fallbackImage = `${process.env.REACT_APP_API_BASE_URL}/images/default-image.jpg`;

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    calculateTotalPrice(storedCart);
  }, []);

  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return sum + price * quantity;
    }, 0);
    setTotalPrice(total.toFixed(2));
  };

  const handleRemoveFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotalPrice(updatedCart);
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity <= 0) return;
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotalPrice(updatedCart);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-indigo-700 to-purple-600 py-8 pt-24">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl space-y-8">
        <h1 className="text-4xl font-semibold text-center text-gray-800">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center space-y-6">
            <p className="text-xl text-gray-600">Your cart is empty.</p>
            <p className="text-lg text-gray-500">Start adding items to your cart!</p>
            <Link
              to="/"
              className="px-8 py-4 bg-blue-600 text-white text-lg rounded-full hover:bg-blue-500 transition duration-300"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div>
            <p className="text-lg text-center text-gray-600">
              You have {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart.
            </p>

            {/* Cart Item List */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={`${item._id}-${item.quantity}`}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center space-x-6">
                    <img
                      src={item.imageUrl || fallbackImage}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                    <div>
                      <p className="text-xl font-medium text-gray-800">{item.name}</p>
                      <p className="text-lg text-gray-500">
                        ₹{parseFloat(item.price).toLocaleString("en-IN")}
                      </p>
                      <p className="text-sm text-gray-400">Size: {item.size}</p>

                      {/* Quantity Adjuster */}
                      <div className="flex items-center space-x-4 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <p className="text-lg text-gray-600">{item.quantity}</p>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="mt-6 flex justify-between items-center">
              <p className="text-lg text-gray-800 font-semibold">Total Price</p>
              <p className="text-xl text-gray-800 font-semibold">
                ₹{parseFloat(totalPrice).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Checkout Button */}
            <div className="mt-8 flex justify-center">
              <Link
                to="/checkout"
                className="px-12 py-4 bg-green-600 text-white text-lg rounded-lg shadow-md hover:bg-green-500 transition duration-300"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
