import React, { useEffect, useState } from 'react';
import CarouselBanner from '../organisms/CarouselBanner';
import TopArticles from '../organisms/TopArticles';
import ImageGallery from '../organisms/ImageGallery';
import axios from 'axios';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${apiBaseURL}/api/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiBaseURL]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="home">
      <CarouselBanner />
      <TopArticles products={products} />
      <ImageGallery products={products} />
    </div>
  );
};

export default Home;
