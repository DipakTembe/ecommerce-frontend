import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import ProductGrid from '../molecules/ProductGrid';
import { Link } from 'react-router-dom';

const HomeFashion = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch product data from MongoDB
  useEffect(() => {
    axios
      .get('http://localhost:5001/api/products')
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          throw new Error('API response is not an array');
        }
      })
      .catch((error) => {
        setError('Failed to fetch products');
        console.error('Error fetching products:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Handlers for filter changes
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
            if (range === 'under-5000') return product.price < 5000;
            if (range === '5000-10000') return product.price >= 5000 && product.price <= 10000;
            if (range === 'over-10000') return product.price > 10000;
            return false;
          })
        : true;
      const matchesGender = product.gender === 'Home'; // Ensure the product is for women
      return matchesCategory && matchesBrand && matchesPrice && matchesGender;
    });
  }, [products, selectedCategories, selectedBrands, selectedPrice]);

  // Group products by category dynamically (EthnicWear, WesternWear, FootWear)
  const groupedProducts = useMemo(() => {
    return {
      Furniture: filteredProducts.filter(
        (product) => product.category === 'Furniture'
      ),
      Decor: filteredProducts.filter(
        (product) => product.category === 'Decor'
      ),
      Kitchenware: filteredProducts.filter(
        (product) => product.category === 'Kitchenware'
      ),
    };
  }, [filteredProducts]);

  // Dynamic categories and brands based on available products
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category)));
  }, [products]);

  const brands = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.brand)));
  }, [products]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24 bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      {/* Path */}
      <div className="mb-4 text-lg text-gray-300">
        <Link to="/" className="text-teal-500">
          Home
        </Link>{' '}
        / <span className="text-teal-500">Home's Fashion</span>
      </div>

      {/* Womens Fashion Title and Item Count */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Home's Fashion</h1>
        <p className="text-lg text-gray-400">{filteredProducts.length} items available</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Panel */}
        <div className="w-full lg:w-1/4 bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-center border-b pb-2">Filters</h2>

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

          {/* Price Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Price</h3>
            <div>
              {['under-5000', '5000-10000', 'over-10000'].map((range) => (
                <label key={range} className="block text-sm mb-1">
                  <input
                    type="checkbox"
                    value={range}
                    checked={selectedPrice.includes(range)}
                    onChange={() => handlePriceChange(range)}
                    className="mr-2 accent-teal-500"
                  />
                  {range === 'under-5000'
                    ? 'Under ₹5000'
                    : range === '5000-10000'
                    ? '₹5000 - ₹10000'
                    : 'Over ₹10000'}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="w-full lg:w-3/4">
          {Object.keys(groupedProducts).map((category) => (
            <div key={category} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{category}</h2>
              <ProductGrid products={groupedProducts[category]} textColor="black" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomeFashion;
