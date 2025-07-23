import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "./components/organisms/Navbar";
import Footer from "./components/organisms/Footer";
import ScrollToTop from "./components/organisms/ScrollToTop";
import Home from "./components/pages/Home";
import SignIn from "./components/pages/SignIn";
import SignUp from "./components/pages/SignUp";
import Contact from "./components/pages/Contact";
import MensFashion from "./components/pages/MensFashion";
import WomensFashion from "./components/pages/WomensFashion";
import KidsFashion from "./components/pages/KidsFashion";
import HomeFashion from "./components/pages/HomeFashion";
import ProductDetails from "./components/pages/ProductDetails";
import WishlistPage from "./components/pages/WishlistPage";
import Profile from "./components/pages/Profile";
import EditProfile from "./components/pages/EditProfile";
import CartPage from "./components/pages/CartPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import OrderPage from "./components/pages/OrderPage";
import "./index.css";
import axios from "axios";
import { CartProvider } from "./Context/CartContext";

const App = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiBaseURL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`${apiBaseURL}/api/products`);
        if (Array.isArray(response.data)) {
          setProductData(response.data);
        } else {
          throw new Error("Invalid product data received");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [apiBaseURL]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-600 text-white text-2xl">
        {error}
      </div>
    );
  }

  return (
    <React.StrictMode>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Navbar />
          <main className="flex-1 pt-16 min-h-screen bg-neutral-900 text-white">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlistPage" element={<WishlistPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/edit" element={<EditProfile />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order/:orderId" element={<OrderPage />} />
              <Route path="/mens-fashion" element={<MensFashion productData={productData} />} />
              <Route path="/womens-fashion" element={<WomensFashion />} />
              <Route path="/kids-fashion" element={<KidsFashion />} />
              <Route path="/home-fashion" element={<HomeFashion />} />
              <Route path="/product/:id" element={<ProductDetails />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CartProvider>
    </React.StrictMode>
  );
};

export default App;
