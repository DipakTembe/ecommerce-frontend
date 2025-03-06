import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartNotification, setCartNotification] = useState(null);
  const [isProductInCart, setIsProductInCart] = useState(false);

  // Fallback image URL
  const fallbackImage = "http://localhost:5001/images/default-image.jpg";

  // Fetch product details
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/products/${id}`)
      .then((response) => {
        if (response.status === 200) {
          setProduct(response.data);
          setLoading(false);
        } else {
          setError("Failed to fetch product data");
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        setError("Failed to fetch product data");
        setLoading(false);
      });
  }, [id]);

  // Handle Wishlist Toggle
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsInWishlist(wishlist.some(item => item._id === product?._id));
  }, [product]);

  // Toggle Wishlist
  const handleWishlistToggle = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isProductInWishlist = wishlist.some(item => item._id === product._id);

    if (isProductInWishlist) {
      // Remove product from wishlist if already added
      wishlist = wishlist.filter((item) => item._id !== product._id);
    } else {
      // Add product to wishlist
      wishlist.push(product);
    }

    // Save updated wishlist to localStorage
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    
    // Update wishlist state to reflect the change
    setIsInWishlist(!isProductInWishlist);
  };

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (product?.gender !== "Home" && !selectedSize) {
      setCartNotification("Please select a size before adding to the cart.");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(item => item._id === product._id && item.size === selectedSize);

    if (existingProductIndex > -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      const newProduct = {
        ...product,
        size: product?.gender !== "Home" ? selectedSize : undefined, // Only include size for non-Home products
        quantity: 1,
      };
      cart.push(newProduct);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setIsProductInCart(true);
    setCartNotification("Product added to cart!");
  };

  // Handle Move to Cart (redirect to cart page)
  const handleMoveToCart = () => {
    window.location.href = "/cart"; // Redirect to the cart page
  };

  // Notification Timeout
  useEffect(() => {
    if (cartNotification) {
      const timer = setTimeout(() => {
        setCartNotification(null);
      }, 3000); // Hide notification after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [cartNotification]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const categoryPath = product?.gender === "Mens" ? "mens-fashion" : product?.gender === "Womens" ? "womens-fashion" : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white py-12 pt-24">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Breadcrumb Path */}
        <div className="text-sm text-gray-400 mb-6">
          <Link to="/" className="font-semibold text-blue-500 hover:text-blue-400">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link to={`/${categoryPath}`} className="font-semibold text-blue-500 hover:text-blue-400">
            {product?.gender === "Mens" ? "Men's" : product?.gender === "Womens" ? "Women's" : "Home"} Fashion
          </Link>{" "}
          &gt;{" "}
          <span className="text-white">{product?.name}</span>
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[500px] mb-6 lg:mb-0">
            <img
              src={product?.imageUrl || fallbackImage}
              alt={product?.name}
              className="rounded-xl shadow-2xl w-full h-[500px] object-cover transition-transform hover:scale-105"
              onError={(e) => {
                e.target.onerror = null; // Prevent infinite loop
                e.target.src = fallbackImage; // Replace with fallback image
              }}
            />
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-3xl lg:text-4xl font-semibold text-white">{product?.name}</h1>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-400">{product?.brand}</h2>
            <p className="text-2xl lg:text-3xl font-extrabold text-blue-400">
              ₹{product?.price.toLocaleString("en-IN")}
            </p>

            {/* Stock Status */}
            <p className={`text-lg font-medium ${Number(product?.stock) > 0 ? "text-green-500" : "text-red-500"}`}>
              {Number(product?.stock) > 0 ? "In Stock" : "Out of Stock"}
            </p>

            {/* Conditionally render size selection for products that are not "Home" */}
            {product?.gender !== "Home" && (
              <div className="flex gap-4 mt-4">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    className={`w-12 h-12 rounded-full ${selectedSize === size ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-400"}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="flex gap-4 mt-6">
              <button
                onClick={isProductInCart ? handleMoveToCart : handleAddToCart}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105"
              >
                <FaShoppingCart />
                {isProductInCart ? "Move to Cart" : "Add to Cart"}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                className={`flex items-center gap-3 ${isInWishlist ? "bg-red-500 text-white shadow-xl transform scale-105" : "bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white"} py-3 px-6 rounded-lg transition-all duration-300 ease-in-out focus:outline-none`}
              >
                <FaHeart className={`text-2xl transition-all duration-300 ${isInWishlist ? "animate-pulse" : ""}`} />
                <span className="font-semibold">{isInWishlist ? "Wishlisted" : "Add to Wishlist"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Cart Notification */}
        {cartNotification && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg transition-transform">
            {cartNotification}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
