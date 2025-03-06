import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faUser, faSearch, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  // States for user authentication and name
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");

  // Memoizing the handleLogout function using useCallback to avoid unnecessary re-creations
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("User");
    navigate("/signin"); // Redirect to sign-in page
  }, [navigate]);

  // Check if user is logged in and fetch user data
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      if (token) {
        axios
          .get("http://localhost:5001/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setUserName(response.data.username || "User");
            setIsLoggedIn(true);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
            handleLogout(); // Log out the user if there's an error (e.g., invalid token)
          });
      } else {
        setIsLoggedIn(false);
        setUserName("User");
      }
    };

    checkLoginStatus();
  }, [handleLogout]);

  return (
    <nav className="fixed w-full z-20 top-0 left-0 bg-transparent backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          <Link to="/">Dipak</Link>
        </div>

        {/* Search Bar */}
        <div className="relative hidden md:block mx-4 flex-1 max-w-xs">
          <input
            type="text"
            className="w-full p-3 pl-10 pr-4 rounded-full bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search..."
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-white font-medium">
          {/* MEN Section */}
          <li className="relative group">
            <Link to="/mens-fashion" className="hover:text-gray-300 transition">MEN</Link>
            <div className="absolute left-0 top-full mt-2 w-64 bg-white text-black rounded-lg shadow-lg opacity-0 invisible scale-95 transform transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:scale-100">
              <ul className="p-4 space-y-2">
                <li><Link to="/mens-fashion#topwear" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Topwear</Link></li>
                <li><Link to="/mens-fashion#bottomwear" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Bottomwear</Link></li>
                <li><Link to="/mens-fashion#sportswear" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Sportswear</Link></li>
              </ul>
            </div>
          </li>

          {/* WOMEN Section */}
          <li className="relative group">
            <Link to="/womens-fashion" className="hover:text-gray-300 transition">WOMEN</Link>
            <div className="absolute left-0 top-full mt-2 w-64 bg-white text-black rounded-lg shadow-lg opacity-0 invisible scale-95 transform transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:scale-100">
              <ul className="p-4 space-y-2">
                <li><Link to="/womens-fashion#ethnicwear" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Ethnic Wear</Link></li>
                <li><Link to="/womens-fashion#westernwear" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Western Wear</Link></li>
                <li><Link to="/womens-fashion#footwear" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Footwear</Link></li>
                <li><Link to="/womens-fashion#bags" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Bags</Link></li>
              </ul>
            </div>
          </li>

          {/* KIDS Section */}
          <li className="relative group">
            <Link to="/kids-fashion" className="hover:text-gray-300 transition">KIDS</Link>
            <div className="absolute left-0 top-full mt-2 w-64 bg-white text-black rounded-lg shadow-lg opacity-0 invisible scale-95 transform transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:scale-100">
              <ul className="p-4 space-y-2">
                <li><Link to="/kids-fashion#boysclothing" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Boys Clothing</Link></li>
                <li><Link to="/kids-fashion#girlsclothing" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Girls Clothing</Link></li>
                <li><Link to="/kids-fashion#accessories" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Accessories</Link></li>
              </ul>
            </div>
          </li>

          {/* HOME & LIVING Section */}
          <li className="relative group">
            <Link to="/home-fashion" className="hover:text-gray-300 transition">HOME & LIVING</Link>
            <div className="absolute left-0 top-full mt-2 w-64 bg-white text-black rounded-lg shadow-lg opacity-0 invisible scale-95 transform transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:scale-100">
              <ul className="p-4 space-y-2">
                <li><Link to="/home-living#furniture" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Furniture</Link></li>
                <li><Link to="/home-living#kitchenware" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Kitchenware</Link></li>
                <li><Link to="/home-living#decor" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Decor</Link></li>
              </ul>
            </div>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Wishlist */}
          {isLoggedIn && (
            <Link to="/wishlistPage" className="flex items-center text-white hover:text-gray-300 transition">
              <FontAwesomeIcon icon={faHeart} className="mr-2 text-lg" />
              <span className="font-medium">Wishlist</span>
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="flex items-center text-white hover:text-gray-300 transition">
            <FontAwesomeIcon icon={faBagShopping} className="mr-2 text-lg" />
            <span className="font-medium">Cart</span>
          </Link>

          {/* Profile or Sign In Button */}
          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center text-white hover:text-gray-300 transition">
                <FontAwesomeIcon icon={faUser} className="mr-2" />
                {`Welcome, ${userName}`}
              </button>
              {/* Dropdown menu after login */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white text-black rounded-lg shadow-lg opacity-0 invisible transform scale-95 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:scale-100">
                <div className="p-4">
                  <h2 className="text-lg font-bold text-gray-800">Welcome, {userName}!</h2>
                  <ul className="space-y-2 mt-3">
                    <li><Link to="/order" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Orders</Link></li>
                    <li><Link to="/profile" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Profile</Link></li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 w-full text-left rounded hover:bg-gray-100 transition"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/signin"
              className="text-white hover:text-gray-300 font-medium transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
