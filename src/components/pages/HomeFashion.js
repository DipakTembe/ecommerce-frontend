import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import ProductGrid from "../molecules/ProductGrid";
import { Link } from "react-router-dom";

const HomeFashion = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false); // NEW

  const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${apiBaseURL}/api/products`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          throw new Error("API response is not an array");
        }
      })
      .catch((err) => {
        setError("Failed to fetch products");
        console.error("Error fetching products:", err);
      })
      .finally(() => setLoading(false));
  }, [apiBaseURL]);

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
    return products.filter((product) => {
      if (product.gender !== "Home") return false;

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

      return matchesCategory && matchesBrand && matchesPrice;
    });
  }, [products, selectedCategories, selectedBrands, selectedPrice]);

  const groupedProducts = useMemo(() => {
    return {
      Furniture: filteredProducts.filter((product) => product.category === "Furniture"),
      Decor: filteredProducts.filter((product) => product.category === "Decor"),
      Kitchenware: filteredProducts.filter((product) => product.category === "Kitchenware"),
    };
  }, [filteredProducts]);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        products
          .filter((p) => ["Furniture", "Decor", "Kitchenware"].includes(p.category))
          .map((p) => p.category)
      )
    );
  }, [products]);

  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
  }, [products]);

  if (loading) return <div className="text-center py-12 text-gray-300">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 pt-24 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-400">
        <Link to="/" className="text-teal-400 hover:underline">Home</Link> /{" "}
        <span className="text-gray-200">Home Fashion</span>
      </div>

      {/* Header with Toggle */}
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
        <div>
          <h1 className="text-3xl font-bold">Home Fashion</h1>
          <p className="text-gray-400">{filteredProducts.length} items available</p>
        </div>
        <button
          className="sm:hidden inline-block bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters */}
        <aside
          className={`w-full lg:w-1/4 bg-gray-800 p-4 rounded-lg shadow-md transition-all duration-300 ${
            showFilters ? "block" : "hidden sm:block"
          }`}
        >
          <h2 className="text-xl font-semibold text-center border-b border-gray-600 pb-2 mb-4">
            Filters
          </h2>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Category</h3>
            {categories.map((category) => (
              <label key={category} className="block text-sm mb-1 cursor-pointer">
                <input
                  type="checkbox"
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
            <h3 className="font-semibold mb-2">Brand</h3>
            {brands.map((brand) => (
              <label key={brand} className="block text-sm mb-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="mr-2 accent-teal-500"
                />
                {brand}
              </label>
            ))}
          </div>

          {/* Price Filter */}
          <div>
            <h3 className="font-semibold mb-2">Price</h3>
            {["under-5000", "5000-10000", "over-10000"].map((range) => (
              <label key={range} className="block text-sm mb-1 cursor-pointer">
                <input
                  type="checkbox"
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
          {Object.keys(groupedProducts).map((category) =>
            groupedProducts[category].length > 0 ? (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                <ProductGrid products={groupedProducts[category]} />
              </div>
            ) : null
          )}
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-400">No products found</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomeFashion;
