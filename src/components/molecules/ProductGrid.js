import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";

// Use backend URL from environment variable
const backendURL = process.env.REACT_APP_BACKEND_URL;
const fallbackImage = `${backendURL}/images/default-image.jpg`;

const ProductGrid = ({ products, error, loading }) => {
  if (loading) {
    return <div className="text-center text-gray-500">Loading products...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Failed to load products. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div
          key={product._id || product.name}
          className="bg-gray-800 p-6 rounded-lg shadow-lg relative group hover:scale-105 transition-all duration-300 ease-in-out"
        >
          <Link to={`/product/${product._id}`}>
            {/* Product Image */}
            <div className="relative mb-4">
              <img
                src={product.imageUrl ? `${backendURL}${product.imageUrl}` : fallbackImage}
                alt={product.name || "Product image"}
                className="w-full h-48 object-cover rounded-md group-hover:scale-110 transition-transform duration-300 ease-in-out"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = fallbackImage;
                }}
              />

              {/* Rating and Buyers */}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-sm p-2 rounded-md">
                <p>
                  <FaStar className="inline text-yellow-400" /> {product.rating || 0} |{" "}
                  {product.buyers >= 1000
                    ? `${(product.buyers / 1000).toFixed(1)}k`
                    : product.buyers || 0}
                </p>
              </div>

              {/* Stock Availability */}
              {product.stock === 0 && (
                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs p-1 rounded-tr-md">
                  Sold Out
                </div>
              )}
            </div>

            {/* Product Details */}
            <h3 className="text-white font-bold">{product.brand || "Unknown Brand"}</h3>
            <p className="text-gray-400">{product.type || "No Type"}</p>
            <div className="flex items-center justify-between">
              <p className="text-teal-400">{`₹${product.price || 0}`}</p>

              {product.discount && (
                <span className="text-red-500 line-through">{`₹${product.originalPrice}`}</span>
              )}
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
