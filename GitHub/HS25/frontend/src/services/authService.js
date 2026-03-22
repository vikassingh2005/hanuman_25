import axios from 'axios';

const API_URL = '/api/auth/';

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL + 'register', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData);

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
};

// Get user profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(API_URL + 'me', config);
  return response.data;
};

// Update user profile
const updateProfile = async (userData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.put(API_URL + 'updatedetails', userData, config);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getProfile,
  updateProfile
};

export default authService;