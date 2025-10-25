import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
export const recommendCrops = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/recommend`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};