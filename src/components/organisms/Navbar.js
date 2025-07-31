import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faBagShopping,
  faUser,
  faSearch,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import { UserContext } from "../../Context/UserContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(UserContext);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownTimeout = useRef(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserName("User");
    setUser(null);
    navigate("/signin");
  }, [navigate, setUser]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${API_BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUserName(res.data.username || "User");
          setIsLoggedIn(true);
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Auth Error:", err);
          localStorage.removeItem("token");
          setIsLoggedIn(false);
          setUserName("User");
          setUser(null);
        });

    }
  }, [handleLogout, setUser]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleMouseEnter = () => {
    clearTimeout(dropdownTimeout.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeout.current = setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const navLinks = [
    { name: "MEN", path: "/mens-fashion" },
    { name: "WOMEN", path: "/womens-fashion" },
    { name: "KIDS", path: "/kids-fashion" },
    { name: "HOME & LIVING", path: "/home-fashion" },
  ];

  return (
    <nav className="fixed w-full z-20 top-0 left-0 bg-black/70 backdrop-blur-md text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Left: Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">Dipak</Link>
        </div>

        {/* Middle: Search Bar */}
        <div className="flex-grow mx-2 max-w-xs sm:max-w-sm md:max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full bg-gray-800 text-white p-2 rounded-full pl-10 focus:ring-2 focus:ring-blue-500 text-sm"
              aria-label="Search"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-gray-400 cursor-pointer"
              onClick={handleSearch}
            />
          </div>
        </div>

        {/* Right: Toggle Menu */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle menu">
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-6 font-medium ml-4">
          {navLinks.map(({ name, path }) => (
            <li key={name}>
              <Link
                to={path}
                className={`transition ${location.pathname === path
                    ? "text-teal-400 underline underline-offset-4"
                    : "hover:text-gray-300"
                  }`}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right Icons */}
        <div className="hidden md:flex items-center space-x-4 ml-4">
          {isLoggedIn && (
            <Link
              to="/wishlistPage"
              className="hover:text-gray-300"
              aria-label="Wishlist"
            >
              <FontAwesomeIcon icon={faHeart} />
            </Link>
          )}

          <Link to="/cart" className="hover:text-gray-300" aria-label="Cart">
            <FontAwesomeIcon icon={faBagShopping} />
          </Link>

          {isLoggedIn ? (
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="hover:text-gray-300 flex items-center"
                aria-haspopup="true"
                aria-expanded={showDropdown}
              >
                <FontAwesomeIcon icon={faUser} className="mr-1" /> Hello,{" "}
                {user?.name || userName}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg min-w-[150px] z-50">
                  <ul className="p-2 space-y-1">
                    <li>
                      <Link
                        to="/order"
                        onClick={() => setShowDropdown(false)}
                        className="block hover:bg-gray-100 px-4 py-2"
                      >
                        Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="block hover:bg-gray-100 px-4 py-2"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}
                        className="block w-full text-left hover:bg-gray-100 px-4 py-2"
                        type="button"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signin" className="hover:text-gray-300">
              Sign In
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 text-white px-4 py-4 space-y-4">
          {navLinks.map(({ name, path }) => (
            <Link
              key={name}
              to={path}
              onClick={toggleMenu}
              className="block hover:text-gray-300"
            >
              {name}
            </Link>
          ))}

          <div className="border-t border-gray-700 pt-4">
            <Link
              to="/cart"
              onClick={toggleMenu}
              className="block hover:text-gray-300 mb-2 flex items-center"
            >
              <FontAwesomeIcon icon={faBagShopping} className="mr-2" /> Cart
            </Link>
            {isLoggedIn && (
              <Link
                to="/wishlistPage"
                onClick={toggleMenu}
                className="block hover:text-gray-300 mb-2 flex items-center"
              >
                <FontAwesomeIcon icon={faHeart} className="mr-2" /> Wishlist
              </Link>
            )}
            {isLoggedIn ? (
              <>
                <Link
                  to="/profile"
                  onClick={toggleMenu}
                  className="block hover:text-gray-300 mb-2 flex items-center"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block hover:text-gray-300 w-full text-left"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/signin"
                onClick={toggleMenu}
                className="block hover:text-gray-300"
              >
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
