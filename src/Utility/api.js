import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

// Get Token from localStorage
const getToken = () => localStorage.getItem('token');

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API call with Token
export const apiWithToken = async (url, method = 'GET', data = {}, config = {}) => {
  const token = getToken();

  if (!token) throw new Error('Authentication token is missing. Please log in.');

  try {
    const response = await api({
      url,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...config,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'API responded with an unexpected error.');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown API error.';
    console.error('API With Token Error:', errorMessage);
    throw new Error(errorMessage);
  }
};

// API call without Token
export const apiWithoutToken = async (url, method = 'GET', data = {}, config = {}) => {
  try {
    const response = await api({
      url,
      method,
      data,
      ...config,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'API responded with an unexpected error.');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Unknown API error.';
    console.error('API Without Token Error:', errorMessage);
    throw new Error(errorMessage);
  }
};
