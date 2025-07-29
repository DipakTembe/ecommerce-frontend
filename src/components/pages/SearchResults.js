import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductGrid from '../molecules/ProductGrid';

const SearchResults = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/products/search?q=${query}`
        );
        setProducts(response.data || []);
      } catch (err) {
        console.error('Failed to fetch search results:', err.message);
        setProducts([]);
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
        Search Results for &quot;{query}&quot;
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : products.length > 0 ? (
        <ProductGrid products={products} loading={loading} />
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchResults;
