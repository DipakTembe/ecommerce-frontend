import React, { useEffect, useState } from 'react';
import CarouselBanner from '../organisms/CarouselBanner';
import TopArticles from '../organisms/TopArticles';
import ImageGallery from '../organisms/ImageGallery';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("/api/products")
      .then((response) => {
        setProducts(response.data);  // ✅ Set the fetched products
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home">
      <CarouselBanner />
      <TopArticles products={products} />  {/* ✅ Pass products as props */}
      <ImageGallery products={products} />  {/* ✅ Pass products as props */}
    </div>
  );
};

export default Home;
