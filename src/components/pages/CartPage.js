import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

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
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-indigo-700 to-purple-600 py-8 pt-24 px-4">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl space-y-8">
        <h1 className="text-4xl font-semibold text-center text-gray-800">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center space-y-6">
            <p className="text-xl text-gray-600">Your cart is empty.</p>
            <Link
              to="/"
              className="px-8 py-4 bg-blue-600 text-white text-lg rounded-full hover:bg-blue-500 transition duration-300"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-lg text-center text-gray-600">
              You have {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart.
            </p>

            {/* Cart Items */}
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={`${item._id}-${item.quantity}`}
                  className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <img
                      src={item.imageUrl || fallbackImage}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbackImage;
                      }}
                    />
                    <div>
                      <p className="text-xl font-medium text-gray-800">{item.name}</p>
                      <p className="text-lg text-gray-500">₹{Number(item.price).toFixed(2)}</p>
                      <p className="text-sm text-gray-400">Size: {item.size || "Free Size"}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                          aria-label="Decrease Quantity"
                        >
                          -
                        </button>
                        <span className="text-lg">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                          className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                          aria-label="Increase Quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="mt-4 sm:mt-0 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200"
                    aria-label="Remove from Cart"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              ))}
            </div>

            {/* Total and Checkout */}
            <div className="mt-6 flex justify-between items-center text-lg font-semibold text-gray-800">
              <span>Total Price:</span>
              <span>₹{Number(totalPrice).toLocaleString("en-IN")}</span>
            </div>

            <div className="mt-8 flex justify-center">
              <Link
                to="/checkout"
                className="px-12 py-4 bg-green-600 text-white text-lg rounded-lg hover:bg-green-500 transition duration-300"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPage;
