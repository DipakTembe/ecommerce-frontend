import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

const getToken = () => localStorage.getItem('token');

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Function that works with: apiWithToken("/endpoint", "POST", data)
export const apiWithToken = async (url, method = 'GET', data = {}, config = {}) => {
  const token = getToken();

  if (!token) throw new Error('Authentication token missing. Please log in.');

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
