import axios from 'axios';

const API_URL = '/api/profile';

// Get user profile
const getUserProfile = async () => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.get(API_URL, config);
  return response.data.data;
};

// Update user profile
const updateUserProfile = async (userData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.put(API_URL, userData, config);
  return response.data.data;
};

// Upload avatar
const uploadAvatar = async (imageData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
  
  const response = await axios.put(`${API_URL}/avatar`, { image: imageData }, config);
  return response.data.data;
};

// Change password
const changePassword = async (passwordData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
  
  const response = await axios.put(`${API_URL}/password`, passwordData, config);
  return response.data;
};

const userService = {
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  changePassword
};

export default userService;