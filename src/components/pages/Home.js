import React, { useEffect, useState } from 'react';
import CarouselBanner from '../organisms/CarouselBanner';
import TopArticles from '../organisms/TopArticles';
import ImageGallery from '../organisms/ImageGallery';
import axios from 'axios';

const Home = () => {
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    axios.get("/api/products")
      .then((response) => {
        // No need to set products anymore
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
      })
      .finally(() => {
        setLoading(false); // Stop loading once request is completed
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Show loading message
  }

  if (error) {
    return <div>{error}</div>; // Show error message if fetching fails
  }

  return (
    <div className="home">
      <CarouselBanner />
      <TopArticles />
      <ImageGallery />
    </div>
  );
};

export default Home;
