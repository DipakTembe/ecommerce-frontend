import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

// Basic Axios instance (no token by default)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Get token from localStorage (for optional use elsewhere)
const getToken = () => localStorage.getItem('token');

// ✅ Function: API call with token — used only when needed
export const apiWithToken = async (url, method = 'GET', data = {}, config = {}) => {
  const token = getToken();

  if (!token) {
    console.warn('Authentication token missing.');
    return Promise.reject(new Error('Authentication token missing. Please log in.'));
  }

  try {
    const response = await api.request({
      url,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...config,
    });

    return response;
  } catch (error) {
    console.error('API With Token Error:', error?.response?.data || error.message);
    throw error;
  }
};

// ✅ Function: API call without token — general purpose (safe)
export const apiWithoutToken = async (url, method = 'GET', data = {}, config = {}) => {
  try {
    const response = await api.request({
      url,
      method,
      data,
      ...config,
    });

    return response;
  } catch (error) {
    console.error('API Without Token Error:', error?.response?.data || error.message);
    throw error;
  }
};

// ✅ Function: Search products — uses no token and explicitly removes Authorization header
export const searchProducts = async (query) => {
  try {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`, {
      headers: {
        Authorization: undefined,  // Ensure no token is sent with this request
      },
    });
    return response.data;
  } catch (error) {
    console.error('Search API error:', error?.response?.data || error.message);
    return [];
  }
};
