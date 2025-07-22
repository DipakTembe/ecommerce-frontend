import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductGrid from "../molecules/ProductGrid";

const KidsFashion = () => {
  const [productData, setProductData] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/api/products");
        if (!Array.isArray(response.data)) throw new Error("Invalid product data");
        setProductData(response.data);
      } catch (err) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Fetch Error:", err);
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
      return matchesCategory && matchesBrand && matchesPrice && gender === "Kids";
    });
  }, [productData, selectedCategories, selectedBrands, selectedPrice]);

  const groupedProducts = useMemo(() => {
    return {
      "Boy Clothing": filteredProducts.filter((p) => p.category === "Boy Clothing"),
      "Girl Clothing": filteredProducts.filter((p) => p.category === "Girl Clothing"),
      Accessories: filteredProducts.filter((p) => p.category === "Accessories"),
    };
  }, [filteredProducts]);

  const categories = useMemo(() => {
    return Array.from(new Set(productData.map((p) => p.category))).filter((cat) =>
      ["Boy Clothing", "Girl Clothing", "Accessories"].includes(cat)
    );
  }, [productData]);

  const brands = useMemo(() => {
    return Array.from(new Set(productData.map((p) => p.brand)));
  }, [productData]);

  if (loading) return <div className="text-center text-gray-400">Loading products...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 pt-24 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="mb-4 text-lg text-gray-300">
        <Link to="/" className="text-teal-500 hover:underline">Home</Link> /
        <span className="text-teal-500"> Kids Fashion</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Kids Fashion</h1>
        <p className="text-lg text-gray-400">{filteredProducts.length} items available</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filter Section */}
        <div className="w-full lg:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-center border-b pb-2">Filters</h2>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Category</h3>
            {categories.map((category) => (
              <label key={category} className="block text-sm mb-1">
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

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Brand</h3>
            {brands.map((brand) => (
              <label key={brand} className="block text-sm mb-1">
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

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Price</h3>
            {["under-5000", "5000-10000", "over-10000"].map((range) => (
              <label key={range} className="block text-sm mb-1">
                <input
                  type="checkbox"
                  checked={selectedPrice.includes(range)}
                  onChange={() => handlePriceChange(range)}
                  className="mr-2 accent-teal-500"
                />
                {range === "under-5000" ? "Under ₹5000" : range === "5000-10000" ? "₹5000 - ₹10000" : "Over ₹10000"}
              </label>
            ))}
          </div>
        </div>

        {/* Product Section */}
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
