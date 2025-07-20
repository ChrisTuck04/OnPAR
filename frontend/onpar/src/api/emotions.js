import axios from "axios";

const API_URL = import.meta.env.VITE_API_EMOTIONS_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };
};

export const createEmotion = async (emotionData) => {
  const response = await axios.post(`${API_URL}/create-emotion`, emotionData, getAuthHeaders());
  return response.data;
};

export const readEmotions = async (startDate, endDate) => {
  const response = await axios.post(`${API_URL}/read-emotions`, {
    startDate,
    endDate
  }, getAuthHeaders());
  return response.data;
};

export const updateEmotion = async (emotionId, emotionData) => {
  const response = await axios.post(`${API_URL}/update-emotion`, {
    emotionId,
    ...emotionData
  }, getAuthHeaders());
  return response.data;
};

export const deleteEmotion = async (emotionId) => {
  const response = await axios.post(`${API_URL}/delete-emotion`, {
    emotionId
  }, getAuthHeaders());
  return response.data;
};
