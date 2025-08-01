import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-6 text-sm">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {/* Column 1: Social Media */}
                    <div>
                        <h3 className="font-semibold text-base mb-2">Follow Us</h3>
                        <div className="flex space-x-3 text-lg">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500">
                                <i className="fab fa-instagram"></i>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="font-semibold text-base mb-2">Quick Links</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-white">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link>
                            </li>
                            <li>
                                <Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Categories */}
                    <div>
                        <h3 className="font-semibold text-base mb-2">Categories</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link to="/mens-fashion" className="text-gray-400 hover:text-white">Men</Link>
                            </li>
                            <li>
                                <Link to="/womens-fashion" className="text-gray-400 hover:text-white">Women</Link>
                            </li>
                            <li>
                                <Link to="/kids-fashion" className="text-gray-400 hover:text-white">Kids</Link>
                            </li>
                            <li>
                                <Link to="/home-fashion" className="text-gray-400 hover:text-white">Home & Living</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="font-semibold text-base mb-2">Contact</h3>
                        <ul className="space-y-1 text-gray-400">
                            <li>Email: support@example.com</li>
                            <li>Phone: +91 8329672473</li>
                            <li>Address: Mumbai, India</li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-6 border-t border-gray-700 pt-3 text-center text-xs text-gray-500">
                    © 2024 All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
