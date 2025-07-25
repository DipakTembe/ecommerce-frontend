// src/components/pages/SearchResults.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiWithoutToken } from '../../Utility/api';
import ProductGrid from '../molecules/ProductGrid'; // ✅ Correct component

const SearchResults = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await apiWithoutToken(`/products/search?q=${query}`);
        setProducts(response.data || []);
      } catch (err) {
        console.error('Failed to fetch search results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Search Results for "{query}"
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
