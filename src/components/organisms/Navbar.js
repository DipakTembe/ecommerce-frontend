import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faUser, faSearch, faHeart, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("User");
    navigate("/signin");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:5001/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserName(res.data.username || "User");
          setIsLoggedIn(true);
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, [handleLogout]);

  return (
    <nav className="fixed w-full z-20 top-0 left-0 bg-transparent backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold text-white">
          <Link to="/">Dipak</Link>
        </div>

        {/* Hamburger Icon */}
        <button
          className="text-white md:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
        </button>

        {/* Search Bar */}
        <div className="hidden md:block mx-4 flex-1 max-w-xs relative">
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

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-white font-medium items-center">
          {/* Links with Dropdowns */}
          {["MEN", "WOMEN", "KIDS", "HOME & LIVING"].map((item, index) => (
            <li key={index} className="relative group">
              <Link
                to={
                  item === "MEN" ? "/mens-fashion" :
                  item === "WOMEN" ? "/womens-fashion" :
                  item === "KIDS" ? "/kids-fashion" :
                  "/home-fashion"
                }
                className="hover:text-gray-300 transition"
              >
                {item}
              </Link>
              {/* Example dropdown, customize as needed */}
              <div className="absolute left-0 top-full mt-2 w-64 bg-white text-black rounded-lg shadow-lg opacity-0 invisible scale-95 transform transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100">
                <ul className="p-4 space-y-2">
                  <li><Link to="/" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Subcategory 1</Link></li>
                  <li><Link to="/" className="block px-4 py-2 rounded hover:bg-gray-100 transition">Subcategory 2</Link></li>
                </ul>
              </div>
            </li>
          ))}

          {/* Wishlist */}
          {isLoggedIn && (
            <Link to="/wishlistPage" className="hover:text-gray-300 transition flex items-center">
              <FontAwesomeIcon icon={faHeart} className="mr-1" /> Wishlist
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" className="hover:text-gray-300 transition flex items-center">
            <FontAwesomeIcon icon={faBagShopping} className="mr-1" /> Cart
          </Link>

          {/* Profile or SignIn */}
          {isLoggedIn ? (
            <div className="relative group">
              <button className="flex items-center hover:text-gray-300 transition">
                <FontAwesomeIcon icon={faUser} className="mr-1" />
                {`Welcome, ${userName}`}
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white text-black rounded-lg shadow-lg opacity-0 invisible transform scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:visible group-hover:scale-100">
                <ul className="p-2 space-y-2">
                  <li><Link to="/order" className="block px-4 py-2 hover:bg-gray-100">Orders</Link></li>
                  <li><Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link></li>
                  <li><button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button></li>
                </ul>
              </div>
            </div>
          ) : (
            <Link to="/signin" className="hover:text-gray-300 transition">
              Sign In
            </Link>
          )}
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black text-white space-y-4 px-4 py-4">
          <Link to="/mens-fashion" onClick={() => setMenuOpen(false)}>MEN</Link>
          <Link to="/womens-fashion" onClick={() => setMenuOpen(false)}>WOMEN</Link>
          <Link to="/kids-fashion" onClick={() => setMenuOpen(false)}>KIDS</Link>
          <Link to="/home-fashion" onClick={() => setMenuOpen(false)}>HOME & LIVING</Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link>
          {isLoggedIn && <Link to="/wishlistPage" onClick={() => setMenuOpen(false)}>Wishlist</Link>}
          {isLoggedIn ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</button>
            </>
          ) : (
            <Link to="/signin" onClick={() => setMenuOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
