import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import ProductGrid from "../molecules/ProductGrid";

const KidsFashion = () => {
  const [productData, setProductData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetching product data (mock example for now)
    const fetchProductData = async () => {
      try {
        const response = await fetch("/api/products"); // Adjust API endpoint as needed
        const data = await response.json();
        if (Array.isArray(data)) {
          setProductData(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError("Failed to fetch products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((cat) => cat !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    );
  };

  const handlePriceChange = (price) => {
    setSelectedPrice((prev) =>
      prev.includes(price)
        ? prev.filter((p) => p !== price)
        : [...prev, price]
    );
  };

  // Memoized filtered products based on selected filters
  const filteredProducts = useMemo(() => {
    if (!Array.isArray(productData) || !productData.length) return [];

    return productData.filter((product) => {
      // Filter by category, brand, price, and gender (only Kids)
      const matchesCategory = selectedCategories.length
        ? selectedCategories.includes(product.category)
        : true;
      const matchesBrand = selectedBrands.length
        ? selectedBrands.includes(product.brand)
        : true;
      const matchesPrice = selectedPrice.length
        ? selectedPrice.some((range) => {
            if (range === "under-5000") return product.price < 5000;
            if (range === "5000-10000")
              return product.price >= 5000 && product.price <= 10000;
            if (range === "over-10000") return product.price > 10000;
            return false;
          })
        : true;
      const matchesGender = product.gender === "Kids";

      return matchesCategory && matchesBrand && matchesPrice && matchesGender;
    });
  }, [productData, selectedCategories, selectedBrands, selectedPrice]);

  // Group products by category dynamically (Boy Clothing, Girl Clothing, Accessories)
  const groupedProducts = useMemo(() => {
    return {
      "Boy Clothing": filteredProducts.filter(
        (product) => product.category === "Boy Clothing"
      ),
      "Girl Clothing": filteredProducts.filter(
        (product) => product.category === "Girl Clothing"
      ),
      Accessories: filteredProducts.filter(
        (product) => product.category === "Accessories"
      ),
    };
  }, [filteredProducts]);

  const categories = useMemo(
    () => Array.from(new Set(productData.map((p) => p.category))).filter(
      (category) => ["Boy Clothing", "Girl Clothing", "Accessories"].includes(category)
    ),
    [productData]
  );

  const brands = useMemo(
    () => Array.from(new Set(productData.map((p) => p.brand))),
    [productData]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="mb-4 text-lg text-gray-300">
        <Link to="/" className="text-teal-500 hover:underline">
          Home
        </Link>{" "}
        / <span className="text-teal-500"> Kids Fashion</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Kids Fashion</h1>
        <p className="text-lg text-gray-400">
          {filteredProducts.length} items available
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-center border-b pb-2">Filters</h2>

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

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Brand</h3>
            <div>
              {brands.map((brand) => (
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
            Object.keys(groupedProducts).map((category) => (
              <div key={category} className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                <ProductGrid products={groupedProducts[category]} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default KidsFashion;
