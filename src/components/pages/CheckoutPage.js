import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { apiWithToken } from "../../Utility/api";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    city: "",
    zipCode: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const fallbackImage = "http://localhost:5001/images/default-image.jpg"; 

  // Load cart from localStorage when the component mounts
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
    calculateTotalPrice(storedCart);
  }, []);

  // Calculate the total price of items in the cart
  const calculateTotalPrice = (items) => {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity, 10) || 0;
      return sum + price * quantity;
    }, 0);
    setTotalPrice(total.toFixed(2)); 
  };

  // Handle shipping details change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({ ...shippingDetails, [name]: value });
  };

  // Handle token expiration check
  const checkTokenExpiration = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000); 

      if (decodedToken.exp < currentTime) {
        return true; // Token expired
      } else {
        return false; // Token valid
      }
    } catch (error) {
      return true; // Token invalid or expired
    }
  };

  // Form validation
  const validateForm = () => {
    const { name, email, address, phone, city, zipCode } = shippingDetails;
    if (!name || !email || !address || !phone || !city || !zipCode) {
      setErrorMessage("All fields are required.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to be logged in to place an order.");
      navigate("/login");
      return;
    }

    if (checkTokenExpiration(token)) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;

      if (!userId) {
        alert("User not found in token.");
        navigate("/login");
        return;
      }

      setLoading(true);

      const orderData = {
        userId: userId,
        items: cartItems,
        totalPrice,
        shippingDetails,
      };
// console.log(orderData);
      const response = await apiWithToken('/orders/create', 'POST', orderData);
      // console.log(response);
      localStorage.setItem("orderDetails", JSON.stringify(response.data));

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        navigate(`/order/${response.data._id}`);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-indigo-700 to-purple-600 py-8 pt-24">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl space-y-8">
        <h1 className="text-4xl font-semibold text-center text-gray-800">Checkout</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center space-y-6">
            <p className="text-xl text-gray-600">Your cart is empty.</p>
            <Link
              to="/"
              className="px-8 py-4 bg-blue-600 text-white text-lg rounded-full hover:bg-blue-500 transition duration-300"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div>
            {/* Cart Items Review */}
            <div className="space-y-6">
              <h2 className="text-2xl text-gray-800 font-semibold">Cart Summary</h2>
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md"
                >
                  <div className="flex items-center space-x-6">
                    <img
                      src={item.imageUrl || fallbackImage} 
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = fallbackImage; 
                      }}
                    />
                    <div>
                      <p className="text-xl font-medium text-gray-800">{item.name}</p>
                      <p className="text-lg text-gray-500">₹{item.price.toLocaleString("en-IN")}</p>
                      <p className="text-sm text-gray-400">Size: {item.size}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Shipping Form */}
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <h2 className="text-2xl text-gray-800 font-semibold">Shipping Details</h2>

              {/* Form Fields */}
              {['name', 'email', 'address', 'phone', 'city', 'zipCode'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-gray-700">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    id={field}
                    name={field}
                    value={shippingDetails[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    required
                  />
                </div>
              ))}

              {/* Display Error Message */}
              {errorMessage && (
                <p className="text-red-600 text-sm">{errorMessage}</p>
              )}

              {/* Total Price */}
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg text-gray-800 font-semibold">Total Price</p>
                <p className="text-xl text-gray-800 font-semibold">₹{totalPrice.toLocaleString("en-IN")}</p>
              </div>

              {/* Place Order Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="submit"
                  className="px-12 py-4 bg-green-600 text-white text-lg rounded-lg shadow-md hover:bg-green-500 transition duration-300"
                  disabled={loading}
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm text-center">
              <h2 className="text-2xl text-green-600 font-semibold">Order Placed Successfully!</h2>
              <p className="mt-4 text-gray-600">Thank you for your purchase. We'll send you an email confirmation shortly.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
