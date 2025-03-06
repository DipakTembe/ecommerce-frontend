import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin'); // Redirect to sign-in if token is not found
      return;
    }

    axios
      .get('http://localhost:5001/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data); // Assuming the API returns user data
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setError('Failed to fetch profile data');
        setLoading(false);
      });
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader"></div> {/* You can use any spinner or loader component */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 py-10">
      <div className="container mx-auto px-4 py-8 pt-20">
        <h1 className="text-4xl font-extrabold text-center text-white mb-6">User Profile</h1>

        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4 text-teal-500">Personal Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Name:</span>
              <span className="text-gray-900">{user.username}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Address:</span>
              <span className="text-gray-900">{user.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Mobile:</span>
              <span className="text-gray-900">{user.mobile}</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => navigate('/profile/edit')}
              className="w-full py-2 px-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300 ease-in-out"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
