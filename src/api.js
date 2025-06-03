// src/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE;

if (!API_BASE_URL) {
  console.error('❌ VITE_API_BASE is not defined. Check your .env file');
} else {
  console.log('✅ API base URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
