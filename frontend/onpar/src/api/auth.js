import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};

export const resendVerification = async (email) => {
  const response = await axios.post(`${API_URL}/resend-verification-email`,  { email });
  return response.data;
};