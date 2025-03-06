import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api'; // Replace with your API base URL

// Function to get the token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Axios instance for making requests
const api = axios.create({
  baseURL: API_BASE_URL,
});

// API call with token (for authenticated routes)
export const apiWithToken = async (url, method = 'GET', data = {}) => {
  const token = getToken(); // Retrieve token from localStorage
  
  if (!token) {
    throw new Error('No token provided. User must be logged in.');
  }

  try {
    const response = await api({
      url,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`, // Add Bearer token in the Authorization header
      },
    });


    // Check if response contains success flag
    if (response.status === 201) {
      return response;
    } else {
      throw new Error( response.data.message || 'An error occurred in the API.');
    }
  } catch (error) {
    // Cache the failure message if it exists
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    localStorage.setItem('apiError', errorMessage); // Store error in localStorage (can be used for later)
    
    throw new Error(`Error in API call with token: ${errorMessage}`);
  }
};

// API call without token (for public routes)
export const apiWithoutToken = async (url, method = 'GET', data = {}) => {
  try {
    const response = await api({
      url,
      method,
      data,
    });

    // Check if response contains success flag
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'An error occurred in the API.');
    }
  } catch (error) {
    // Cache the failure message if it exists
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error';
    localStorage.setItem('apiError', errorMessage); // Store error in localStorage (can be used for later)
    
    throw new Error(`Error in API call without token: ${errorMessage}`);
  }
};
