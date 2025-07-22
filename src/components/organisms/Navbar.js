import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faBagShopping, faUser, faSearch, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        .catch((err) => {
          console.error("Auth Error:", err);
          handleLogout();
        });
    }
  }, [handleLogout]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed w-full z-20 top-0 left-0 bg-black/70 backdrop-blur-md text-white">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">Dipak</Link>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>

        {/* Links (Desktop) */}
        <ul className="hidden md:flex space-x-6 font-medium">
          {["MEN", "WOMEN", "KIDS", "HOME & LIVING"].map((item) => (
            <li key={item}>
              <Link
                to={`/${item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="hover:text-gray-300 transition"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-800 text-white p-2 rounded-full pl-10 focus:ring-2 focus:ring-blue-500"
            />
            <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-2.5 text-gray-400" />
          </div>

          {isLoggedIn && (
            <Link to="/wishlistPage" className="hover:text-gray-300">
              <FontAwesomeIcon icon={faHeart} />
            </Link>
          )}

          <Link to="/cart" className="hover:text-gray-300">
            <FontAwesomeIcon icon={faBagShopping} />
          </Link>

          {isLoggedIn ? (
            <div className="relative group">
              <button className="hover:text-gray-300 flex items-center">
                <FontAwesomeIcon icon={faUser} className="mr-1" /> {userName}
              </button>
              <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg hidden group-hover:block">
                <ul className="p-2 space-y-1">
                  <li><Link to="/order" className="block hover:bg-gray-100 px-4 py-2">Orders</Link></li>
                  <li><Link to="/profile" className="block hover:bg-gray-100 px-4 py-2">Profile</Link></li>
                  <li>
                    <button onClick={handleLogout} className="block w-full text-left hover:bg-gray-100 px-4 py-2">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link to="/signin" className="hover:text-gray-300">Sign In</Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 text-white px-4 py-4 space-y-4">
          {["MEN", "WOMEN", "KIDS", "HOME & LIVING"].map((item) => (
            <Link
              key={item}
              to={`/${item.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
              onClick={toggleMenu}
              className="block hover:text-gray-300"
            >
              {item}
            </Link>
          ))}

          <div className="border-t border-gray-700 pt-4">
            <Link to="/cart" onClick={toggleMenu} className="block hover:text-gray-300 mb-2">
              <FontAwesomeIcon icon={faBagShopping} className="mr-2" /> Cart
            </Link>
            {isLoggedIn && (
              <Link to="/wishlistPage" onClick={toggleMenu} className="block hover:text-gray-300 mb-2">
                <FontAwesomeIcon icon={faHeart} className="mr-2" /> Wishlist
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link to="/profile" onClick={toggleMenu} className="block hover:text-gray-300 mb-2">
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                </Link>
                <button onClick={() => { handleLogout(); toggleMenu(); }} className="block hover:text-gray-300">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/signin" onClick={toggleMenu} className="block hover:text-gray-300">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
