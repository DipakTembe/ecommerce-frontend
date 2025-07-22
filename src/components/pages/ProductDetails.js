import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isProductInCart, setIsProductInCart] = useState(false);
  const [cartNotification, setCartNotification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseURL = process.env.REACT_APP_API_BASE_URL;
  const fallbackImage = `${apiBaseURL}/images/default-image.jpg`;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${apiBaseURL}/api/products/${id}`);
        setProduct(response.data);
      } catch {
        setError("Failed to fetch product data");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, apiBaseURL]);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (product) {
      setIsInWishlist(wishlist.some((item) => item._id === product._id));
    }
  }, [product]);

  const handleWishlistToggle = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const isInList = wishlist.some((item) => item._id === product._id);

    if (isInList) {
      wishlist = wishlist.filter((item) => item._id !== product._id);
    } else {
      wishlist.push(product);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setIsInWishlist(!isInList);
  };

  const handleAddToCart = () => {
    if (product?.gender !== "Home" && !selectedSize) {
      setCartNotification("Please select a size before adding to cart.");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex(
      (item) => item._id === product._id && item.size === selectedSize
    );

    if (index > -1) {
      cart[index].quantity += 1;
    } else {
      cart.push({
        ...product,
        size: product.gender !== "Home" ? selectedSize : undefined,
        quantity: 1,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    setIsProductInCart(true);
    setCartNotification("Product added to cart!");
  };

  useEffect(() => {
    if (cartNotification) {
      const timer = setTimeout(() => setCartNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [cartNotification]);

  const handleMoveToCart = () => {
    window.location.href = "/cart";
  };

  if (loading) return <div className="text-center py-12 text-gray-300">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!product) return <div className="text-center text-gray-300 py-12">Product not found</div>;

  const categoryPath =
    product.gender === "Mens"
      ? "mens-fashion"
      : product.gender === "Womens"
      ? "womens-fashion"
      : product.gender === "Kids"
      ? "kids-fashion"
      : "";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white py-12 pt-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-sm text-gray-400 mb-6">
          <Link to="/" className="text-blue-500 hover:underline">Home</Link> &gt;{" "}
          {categoryPath && (
            <>
              <Link to={`/${categoryPath}`} className="text-blue-500 hover:underline">
                {product.gender} Fashion
              </Link>{" "}
              &gt;{" "}
            </>
          )}
          <span>{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-[500px]">
            <img
              src={product.imageUrl || fallbackImage}
              alt={product.name}
              className="rounded-xl shadow-2xl w-full h-[500px] object-cover hover:scale-105 transition-transform"
              onError={(e) => (e.currentTarget.src = fallbackImage)}
            />
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <h1 className="text-4xl font-semibold">{product.name}</h1>
            <h2 className="text-2xl text-gray-400">{product.brand}</h2>
            <p className="text-3xl font-extrabold text-blue-400">
              ₹{product.price.toLocaleString("en-IN")}
            </p>

            <p
              className={`text-lg font-medium ${
                Number(product.stock) > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {Number(product.stock) > 0 ? "In Stock" : "Out of Stock"}
            </p>

            {product.gender !== "Home" && (
              <div className="flex gap-4 mt-4">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full ${
                      selectedSize === size
                        ? "bg-blue-500 text-white"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={isProductInCart ? handleMoveToCart : handleAddToCart}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:scale-105 transition-transform"
              >
                <FaShoppingCart />
                {isProductInCart ? "Move to Cart" : "Add to Cart"}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`flex items-center gap-3 ${
                  isInWishlist
                    ? "bg-red-500 text-white shadow-xl scale-105"
                    : "bg-gray-700 text-gray-300 hover:bg-red-600 hover:text-white"
                } py-3 px-6 rounded-lg transition-all`}
              >
                <FaHeart className="text-2xl" />
                <span>{isInWishlist ? "Wishlisted" : "Add to Wishlist"}</span>
              </button>
            </div>
          </div>
        </div>

        {cartNotification && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg">
            {cartNotification}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
