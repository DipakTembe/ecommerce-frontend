import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-4 grid-cols-2 gap-8">
                    {/* Column 1: Logo and Social Media Links */}
                    <div>
                        <div className="text-2xl font-bold">
                            <Link to="/">Dipak</Link>
                        </div>
                        <div className="mt-4 flex space-x-4">
                            {/* Social Media Icons */}
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
                                <i className="fab fa-facebook-f"></i>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500">
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
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul>
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
                        <h3 className="font-semibold text-lg mb-4">Categories</h3>
                        <ul>
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
                        <h3 className="font-semibold text-lg mb-4">Contact</h3>
                        <ul>
                            <li className="text-gray-400">Email: support@dipak.com</li>
                            <li className="text-gray-400">Phone: +91 8329672473</li>
                            <li className="text-gray-400">Address: Mumbai, India</li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 border-t border-gray-700 pt-4 text-center">
                    <p className="text-sm text-gray-400">© 2024 Dipak. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
