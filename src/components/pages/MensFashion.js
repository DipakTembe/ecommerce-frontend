import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductGrid from "../molecules/ProductGrid";

const MensFashion = () => {
  const [productData, setProductData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products");
        if (!Array.isArray(response.data)) throw new Error("Invalid product data");
        setProductData(response.data);
      } catch (error) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [api]);

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
    return productData.filter((product) => {
      const { category, brand, price, gender } = product;
      if (!category || !brand || price === undefined || !gender) return false;

      const matchesCategory = selectedCategories.length ? selectedCategories.includes(category) : true;
      const matchesBrand = selectedBrands.length ? selectedBrands.includes(brand) : true;
      const matchesPrice = selectedPrice.length
        ? selectedPrice.some((range) => {
            switch (range) {
              case "under-5000":
                return price < 5000;
              case "5000-10000":
                return price >= 5000 && price <= 10000;
              case "over-10000":
                return price > 10000;
              default:
                return false;
            }
          })
        : true;

      return matchesCategory && matchesBrand && matchesPrice && gender === "Mens";
    });
  }, [productData, selectedCategories, selectedBrands, selectedPrice]);

  const categories = useMemo(() => {
    return Array.from(new Set(productData.map((p) => p.category))).filter((cat) =>
      ["Topwear", "Bottomwear", "Sportswear"].includes(cat)
    );
  }, [productData]);

  const mensBrands = useMemo(() => {
    return Array.from(new Set(productData.filter((p) => p.gender === "Mens").map((p) => p.brand)));
  }, [productData]);

  if (loading) return <div className="text-center text-gray-400 pt-24">Loading products...</div>;
  if (error) return <div className="text-center text-red-500 pt-24">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-10 pt-24 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      {/* Breadcrumbs */}
      <div className="mb-4 text-sm text-gray-400">
        <Link to="/" className="text-teal-400 hover:underline">Home</Link> / 
        <span className="text-gray-200 ml-1">Men&#39;s Fashion</span>

      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h1 className="text-3xl font-extrabold">Men&#39;s </h1>
          <p className="text-gray-400 text-sm">{filteredProducts.length} items found</p>
        </div>
        <button
          className="sm:hidden inline-block bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <aside
          className={`w-full lg:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg transition-all duration-300 ${
            showFilters ? "block" : "hidden sm:block"
          }`}
        >
          <h2 className="text-xl font-bold mb-6 text-center border-b border-gray-600 pb-2">Filters</h2>

          {/* Category */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Category</h3>
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

          {/* Brands */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-2">Brand</h3>
            {mensBrands.map((brand) => (
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

          {/* Price */}
          <div>
            <h3 className="text-md font-semibold mb-2">Price</h3>
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
        </aside>

        {/* Product Grid */}
        <main className="w-full lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">No products match your filters.</div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </main>
      </div>
    </div>
  );
};

export default MensFashion;
