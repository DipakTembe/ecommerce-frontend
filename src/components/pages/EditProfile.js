import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [user, setUser] = useState({ username: '', email: '', address: '', mobile: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    axios
      .get(`${API_BASE}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch profile data');
        setLoading(false);
      });
  }, [navigate, API_BASE]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    axios
      .put(
        `${API_BASE}/api/auth/update-profile`,
        {
          username: user.username,
          email: user.email,
          address: user.address,
          mobile: user.mobile,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setSuccess('Profile updated successfully!');
        setIsSubmitting(false);
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setError('Failed to update profile.');
        setIsSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 py-10">
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-4xl font-extrabold text-center text-white mb-6">Edit Profile</h1>

        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-teal-500">Update Your Information</h2>

          {success && (
            <div className="bg-green-200 p-4 rounded-lg mb-4 text-green-800">
              <p>{success}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-200 p-4 rounded-lg mb-4 text-red-800">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label htmlFor="username" className="font-medium text-gray-700">Name:</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={user.username}
                  onChange={handleChange}
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="address" className="font-medium text-gray-700">Address:</label>
                <textarea
                  id="address"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  rows="3"
                  placeholder="Your address"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="mobile" className="font-medium text-gray-700">Mobile:</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={user.mobile}
                  onChange={handleChange}
                  className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Your mobile number"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 ${isSubmitting ? 'bg-gray-400' : 'bg-teal-600'} text-white rounded-lg hover:bg-teal-700 transition duration-300 ease-in-out`}
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-300 ease-in-out"
            >
              Go Back to Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
