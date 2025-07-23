import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
    username: "",
  });

  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post("http://localhost:5001/api/otp/send-otp", {
        email: formData.email,
      });

      if (response.status === 200) {
        setStep(2);
        setSuccessMessage("OTP sent to your email. Please check your inbox.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (!formData.email || !formData.password || !formData.otp || !formData.username) {
        setErrorMessage("Please fill in all fields before submitting.");
        setLoading(false);
        return;
      }

      const otpResponse = await axios.post("http://localhost:5001/api/otp/verify-otp", {
        email: formData.email,
        otp: formData.otp,
        password: formData.password,
        username: formData.username,
      });

      if (otpResponse.status === 201) {
        // Store the JWT token after successful registration
        localStorage.setItem("token", otpResponse.data.token);

        setSuccessMessage("Sign Up Successful! Redirecting...");

        setTimeout(() => {
          navigate("/"); // Redirect to the home page after successful registration
        }, 2000);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage(error.response?.data?.message || "Invalid OTP or registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {step === 1 ? "Sign Up" : "Verify OTP"}
        </h2>

        {successMessage && <div className="text-green-600 text-center mb-4">{successMessage}</div>}
        {errorMessage && <div className="text-red-600 text-center mb-4">{errorMessage}</div>}

        {step === 1 && (
          <form onSubmit={sendOtp}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Enter your email"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtpAndRegister}>
            <div className="mb-4">
              <label htmlFor="otp" className="block text-gray-700">OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg text-black bg-white placeholder-gray-500"

                placeholder="Enter the OTP sent to your email"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                placeholder="Choose a username"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg"
                  placeholder="Create a password"
                  required
                />
                <FontAwesomeIcon
                  icon={passwordVisible ? faEyeSlash : faEye}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;  
