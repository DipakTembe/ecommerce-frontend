import React, { useState, useEffect } from 'react';
import axios from 'axios';

const backendURL = process.env.REACT_APP_BACKEND_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`${backendURL}/api/products`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError('Invalid data format from server');
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;
  if (products.length === 0) return <div className="text-center py-4">No products available</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Product List</h1>
      <ul>
        {products.map((product) => (
          <li key={product._id} className="mb-4">
            <h2 className="text-xl font-semibold">{product.brand || 'Unnamed Product'}</h2>
            <p className="text-gray-600">{product.description || 'No description available'}</p>
            <p className="text-teal-500">{`₹${product.price || 'N/A'}`}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
