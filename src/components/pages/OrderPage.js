import React from "react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
const OrderPage = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { orderId } = useParams();

  const fallbackImage = `${process.env.REACT_APP_API_BASE_URL}/images/default-image.jpg`;

  const storedOrderDetails = useMemo(() => {
    return JSON.parse(localStorage.getItem("orderDetails"));
  }, []);

  useEffect(() => {
    if (storedOrderDetails && storedOrderDetails._id === orderId) {
      setOrderDetails(storedOrderDetails);
      setLoading(false);
    } else {
      navigate("/");
    }
  }, [orderId, storedOrderDetails, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-800 via-indigo-700 to-purple-600">
        <div className="text-center text-white text-2xl">Loading Order...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 via-indigo-700 to-purple-600 py-8 pt-24">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl space-y-8">
        <h1 className="text-4xl font-semibold text-center text-gray-800">Order Details</h1>

        {/* Order Info */}
        <div className="space-y-6">
          <h2 className="text-2xl text-gray-800 font-semibold">Order ID: {orderDetails._id}</h2>
          <p className="text-xl text-gray-600">
            Thank you for your purchase! Your order has been placed successfully.
          </p>
        </div>

        {/* Ordered Items */}
        <div className="space-y-6">
          <h3 className="text-2xl text-gray-800 font-semibold">Ordered Items</h3>
          {orderDetails.items?.length > 0 ? (
            orderDetails.items.map((item) => (
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
                    <p className="text-lg text-gray-500">
                      ₹{parseFloat(item.price)?.toLocaleString("en-IN") || "0"}
                    </p>
                    {item.size && <p className="text-sm text-gray-400">Size: {item.size}</p>}
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    <div className="flex items-center mt-2">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span>{item.rating ? item.rating : "Not Rated"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No items found in this order.</p>
          )}
        </div>

        {/* Shipping Info */}
        <div className="space-y-6">
          <h3 className="text-2xl text-gray-800 font-semibold">Shipping Information</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>Name:</strong> {orderDetails.shippingDetails?.name}</p>
            <p><strong>Email:</strong> {orderDetails.shippingDetails?.email}</p>
            <p><strong>Address:</strong> {orderDetails.shippingDetails?.address}</p>
            <p><strong>Phone:</strong> {orderDetails.shippingDetails?.phone}</p>
            <p><strong>City:</strong> {orderDetails.shippingDetails?.city}</p>
            <p><strong>Zip Code:</strong> {orderDetails.shippingDetails?.zipCode}</p>
          </div>
        </div>

        {/* Total */}
        <div className="mt-4 flex justify-between items-center">
          <p className="text-lg text-gray-800 font-semibold">Total Price</p>
          <p className="text-xl text-gray-800 font-semibold">
            ₹{parseFloat(orderDetails.totalPrice)?.toLocaleString("en-IN") || "0"}
          </p>
        </div>

        {/* Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-12 py-4 bg-blue-600 text-white text-lg rounded-lg shadow-md hover:bg-blue-500 transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
