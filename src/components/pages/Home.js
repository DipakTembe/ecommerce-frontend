import React, { useEffect, useState, lazy, Suspense } from 'react';
import CarouselBanner from '../organisms/CarouselBanner';
import axios from 'axios';

// Lazy load non-critical components
const TopArticles = lazy(() => import('../organisms/TopArticles'));
const ImageGallery = lazy(() => import('../organisms/ImageGallery'));

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${apiBaseURL}/api/products`);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to fetch products');
      } finally {
        setLoadingData(false);
      }
    };

    fetchProducts();
  }, [apiBaseURL]);

  if (loadingData) return <div className="text-center p-4">Loading homepage...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="home">
      <CarouselBanner />

      <Suspense fallback={<div className="text-center p-4">Loading articles...</div>}>
        <TopArticles products={products} />
      </Suspense>

      <Suspense fallback={<div className="text-center p-4">Loading gallery...</div>}>
        <ImageGallery products={products} />
      </Suspense>
    </div>
  );
};

export default Home;
