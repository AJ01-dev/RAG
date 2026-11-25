import axios from 'axios';

export const getApiBaseUrl = () => {
  return localStorage.getItem('rag_api_url') || import.meta.env.VITE_API_URL || '/api';
};

export const setApiBaseUrl = (url) => {
  if (url && url.trim()) {
    localStorage.setItem('rag_api_url', url.trim());
  } else {
    localStorage.removeItem('rag_api_url');
  }
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 60000, // 60s timeout for LLM inference / heavy embedding tasks
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseUrl();
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMsg =
      error.response?.data?.detail ||
      error.message ||
      'An unexpected error occurred';
    console.error('API Error:', errorMsg);
    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
