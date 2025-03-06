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
import EditProfile from "./components/pages/EditProfile";  // <-- Import EditProfile
import CartPage from "./components/pages/CartPage";
import CheckoutPage from "./components/pages/CheckoutPage"; // Import CheckoutPage
import OrderPage from "./components/pages/OrderPage";
import "./index.css";
import axios from "axios";
import { CartProvider } from "./Context/CartContext";

const App = () => {
  const [productData, setProductData] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        // Directly hardcoding the backend URL (for testing)
        const response = await axios.get("http://localhost:5001/api/products"); // Full URL to the backend
        if (Array.isArray(response.data)) {
          setProductData(response.data); // Set product data if valid
        } else {
          console.error("API response is not an array:", response.data);
          setError("Invalid product data received");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (error) {
    return <div>{error}</div>; // Error state
  }

  return (
    <React.StrictMode>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <Navbar /> {/* Navbar with cart functionality */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/wishlistPage" element={<WishlistPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} /> {/* Route to EditProfile */}
            <Route path="/cart" element={<CartPage />} /> {/* CartPage route */}
            <Route path="/checkout" element={<CheckoutPage />} /> {/* Add route for CheckoutPage */}
            <Route path="/order/:orderId" element={<OrderPage />} />
            <Route
              path="/mens-fashion"
              element={<MensFashion productData={productData} />}
            />
            <Route path="/womens-fashion" element={<WomensFashion />} />
            <Route path="/kids-fashion" element={<KidsFashion />} />
            <Route path="/home-fashion" element={<HomeFashion />} />
            <Route
              path="/product/:id"
              element={<ProductDetails products={productData} />}
            />
          </Routes>
          <Footer />
        </Router>
      </CartProvider>
    </React.StrictMode>
  );
};

export default App;
