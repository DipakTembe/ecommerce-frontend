import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ProductGrid from "../molecules/ProductGrid";
import { Link } from "react-router-dom";

const WomensFashion = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use your correct environment variable here
  const API_URL = process.env.REACT_APP_API_BASE_URL || "";

  useEffect(() => {
    axios
      .get(`${API_URL}/api/products`)
      .then((response) => {
        console.log("Fetched products:", response.data); // Debug log
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          throw new Error("API response is not an array");
        }
      })
      .catch((error) => {
        setError("Failed to fetch products");
        console.error("Error fetching products:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_URL]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePriceChange = (price) => {
    setSelectedPrice((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) return [];

    return products.filter((product) => {
      const matchesCategory = selectedCategories.length
        ? selectedCategories.includes(product.category)
        : true;

      const matchesBrand = selectedBrands.length
        ? selectedBrands.includes(product.brand)
        : true;

      const matchesPrice = selectedPrice.length
        ? selectedPrice.some((range) => {
            if (range === "under-5000") return product.price < 5000;
            if (range === "5000-10000") return product.price >= 5000 && product.price <= 10000;
            if (range === "over-10000") return product.price > 10000;
            return false;
          })
        : true;

      // Case-insensitive gender check, supporting multiple possible values
      const gender = (product.gender || "").toLowerCase();
      const matchesGender = gender === "womens" || gender === "women" || gender === "female";

      return matchesCategory && matchesBrand && matchesPrice && matchesGender;
    });
  }, [products, selectedCategories, selectedBrands, selectedPrice]);

  // Group filtered products by category dynamically
  const groupedProducts = useMemo(() => {
    return {
      EthnicWear: filteredProducts.filter((p) => p.category === "EthnicWear"),
      WesternWear: filteredProducts.filter((p) => p.category === "WesternWear"),
      FootWear: filteredProducts.filter((p) => p.category === "FootWear"),
    };
  }, [filteredProducts]);

  // Extract unique categories & brands from all products
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
  }, [products]);

  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).filter(Boolean);
  }, [products]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-600 text-white text-2xl">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      {/* Breadcrumb */}
      <div className="mb-4 text-lg text-gray-300">
        <Link to="/" className="text-teal-500 hover:underline">
          Home
        </Link>{" "}
        / <span className="text-teal-500">Women's Fashion</span>
      </div>

      {/* Title & Count */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Women's Fashion</h1>
        <p className="text-lg text-gray-400">{filteredProducts.length} items available</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <div className="w-full lg:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-center border-b pb-2">Filters</h2>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Category</h3>
            {categories.map((category) => (
              <label key={category} className="block text-sm mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="mr-2 accent-teal-500"
                />
                {category}
              </label>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Brand</h3>
            {brands.map((brand) => (
              <label key={brand} className="block text-sm mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  value={brand}
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="mr-2 accent-teal-500"
                />
                {brand}
              </label>
            ))}
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Price</h3>
            {["under-5000", "5000-10000", "over-10000"].map((range) => (
              <label key={range} className="block text-sm mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  value={range}
                  checked={selectedPrice.includes(range)}
                  onChange={() => handlePriceChange(range)}
                  className="mr-2 accent-teal-500"
                />
                {range === "under-5000"
                  ? "Under ₹5000"
                  : range === "5000-10000"
                  ? "₹5000 - ₹10000"
                  : "Over ₹10000"}
              </label>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="w-full lg:w-3/4">
          {Object.keys(groupedProducts).map((cat) => (
            <div key={cat} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{cat}</h2>
              <ProductGrid products={groupedProducts[cat]} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WomensFashion;
