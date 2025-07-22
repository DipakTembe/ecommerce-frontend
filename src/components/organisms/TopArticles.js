import React, { useEffect, useState } from 'react';

const TopArticles = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch top products (replace with your API endpoint)
    const fetchProducts = async () => {
      const data = [
        {
          id: 1,
          imageUrl: '/images/black-leather-shoes.jpg', // Placeholder image
        },
        {
          id: 2,
          imageUrl: '/images/jackets.jpg', // Placeholder image
        },
        {
          id: 3,
          imageUrl: 'images/wallet.jpg', // Placeholder image
        },
      ]; // Top 3 products
      setProducts(data); // Directly set products
    };

    fetchProducts();
  }, []);

  return (
    <div className="top-products mt-8">
<h2 className="text-3xl font-semibold text-white mb-4 text-center">Top Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 py-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="relative bg-white rounded-xl shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out transform hover:scale-105"
          >
            <img
              src={product.imageUrl}
              alt="Product "
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Transparent "Shop Now" Button */}
            <button className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-transparent text-white border-2 border-white px-5 py-2 rounded-full shadow-lg opacity-80 hover:opacity-100 hover:border-blue-500 transition duration-300">
              Shop Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopArticles;
