import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  // Use backend URL from environment variable or default to localhost
  const BASE_IMAGE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
  const fallbackImage = `${BASE_IMAGE_URL}/images/default-image.jpg`;

  useEffect(() => {
    // Retrieve wishlist from localStorage and clean it
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const cleanedWishlist = storedWishlist.filter(
      (item) => item && item._id && item.name && item.imageUrl
    );
    localStorage.setItem("wishlist", JSON.stringify(cleanedWishlist));
    setWishlist(cleanedWishlist);
  }, []);

  const handleRemoveFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter((item) => item._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const handleMoveToCart = (item) => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = storedCart.findIndex((cartItem) => cartItem._id === item._id);

    if (existingItemIndex >= 0) {
      storedCart[existingItemIndex].quantity += 1;
    } else {
      storedCart.push({
        _id: item._id,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(storedCart));

    const updatedWishlist = wishlist.filter((wishlistItem) => wishlistItem._id !== item._id);
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  if (!wishlist.length) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-purple-700 via-indigo-700 to-blue-700">
        <div className="text-center text-gray-200 p-6">
          <h1 className="text-3xl font-semibold mb-4">Your Wishlist is Empty</h1>
          <p className="text-xl mb-6">
            Start adding products to your wishlist to save them for later!
          </p>
          <Link to="/" className="text-xl text-blue-500 hover:text-blue-400 font-semibold">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-700 via-indigo-700 to-blue-700 text-white py-12">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">
          My Wishlist ({wishlist.length} Items)
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {wishlist.map((item) => (
            <div
              key={item._id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl duration-300 max-w-xl mx-auto"
            >
              <div className="relative">
                <div className="w-56 h-64 mx-auto mb-6">
                  <img
                    src={item.imageUrl ? `${BASE_IMAGE_URL}${item.imageUrl}` : fallbackImage}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImage;
                    }}
                  />
                </div>

                <button
                  onClick={() => handleRemoveFromWishlist(item._id)}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all duration-200"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <FaTrashAlt className="text-lg" />
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-100 truncate">{item.name}</h2>
                <p className="text-lg text-gray-300">₹{item.price.toLocaleString("en-IN")}</p>
                <p className="text-sm text-gray-400">{item.type}</p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => handleMoveToCart(item)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-md hover:from-blue-400 hover:to-blue-500 transition-all duration-300"
                  aria-label={`Move ${item.name} to cart`}
                >
                  Move to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-xl text-blue-500 hover:text-blue-400 font-semibold">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WishlistPage;
