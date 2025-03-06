import React from 'react';
import ProductList from '../organisms/ProductList'; // Import the ProductList component

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to Our E-Commerce Store</h1>
      <ProductList />  {/* Render the ProductList component */}
    </div>
  );
};

export default HomePage;
