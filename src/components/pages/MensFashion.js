import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../molecules/ProductGrid"; // Adjust path if needed

const MensFashion = () => {
  const [productData, setProductData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data from the backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products"); // Adjust API endpoint as needed
        const data = await response.json();

        // Handle API response
        if (Array.isArray(data) && data.length > 0) {
          setProductData(data);
        } else {
          setError("No products available at the moment.");
        }

        setLoading(false);
      } catch (error) {
        setError("Error fetching products: " + error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle category filter change
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  // Handle brand filter change
  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  // Handle price filter change
  const handlePriceChange = (price) => {
    setSelectedPrice((prev) =>
      prev.includes(price)
        ? prev.filter((p) => p !== price)
        : [...prev, price]
    );
  };

  // Memoize filtered products based on selected filters
  const filteredProducts = useMemo(() => {
    if (loading || !Array.isArray(productData) || productData.length === 0) {
      return [];
    }

    return productData.filter((product) => {
      const { category, brand, price, gender } = product;

      // Skip if the product is missing any required fields
      if (!category || !brand || !price || !gender) {
        return false;
      }

      // Apply category filter
      const matchesCategory = selectedCategories.length
        ? selectedCategories.includes(category)
        : true;

      // Apply brand filter
      const matchesBrand = selectedBrands.length
        ? selectedBrands.includes(brand)
        : true;

      // Apply price range filter
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

      // Ensure that the product is for men's fashion
      const matchesGender = gender === "Mens";

      return matchesCategory && matchesBrand && matchesPrice && matchesGender;
    });
  }, [productData, selectedCategories, selectedBrands, selectedPrice, loading]);

  // Get unique categories and brands
  const categories = useMemo(() => {
    return Array.from(new Set(productData.map((p) => p.category))).filter(
      (category) => ["Topwear", "Bottomwear", "Sportswear"].includes(category)
    );
  }, [productData]);

  const mensBrands = useMemo(() => {
    return Array.from(new Set(
      productData.filter((p) => p.gender === "Mens").map((p) => p.brand)
    ));
  }, [productData]);

  // Handle loading and error states
  if (loading) {
    return <div className="text-center text-gray-400">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="mb-4 text-lg text-gray-300">
        <Link to="/" className="text-teal-500 hover:underline">Home</Link> / 
        <span className="text-teal-500"> Men's Fashion</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Men's Fashion</h1>
        <p className="text-lg text-gray-400">
          {filteredProducts.length} items available
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-center border-b pb-2">
            Filters
          </h2>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Category</h3>
            <div>
              {categories.map((category) => (
                <label key={category} className="block text-sm mb-1">
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
          </div>

          {/* Brand Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Brand</h3>
            <div>
              {mensBrands.map((brand) => (
                <label key={brand} className="block text-sm mb-1">
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
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Price</h3>
            <div>
              {["under-5000", "5000-10000", "over-10000"].map((range) => (
                <label key={range} className="block text-sm mb-1">
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
        </div>

        <div className="w-full lg:w-3/4">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-400">No products found</p>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MensFashion;
