import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem('token');

const api = axios.create({ baseURL });

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Always sends FormData: fields + optional files
 *
 * @param {string} url - API endpoint
 * @param {Object} fields - key-value pairs (text fields)
 * @param {File[]} [files] - optional array of files
 */
export const postRequest = async (url, fields = {}, files = []) => {
  try {
    const formData = new FormData();

    // Add all fields (stringify if object)
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(
        key,
        typeof value === 'object' && !(value instanceof File)
          ? JSON.stringify(value)
          : value
      );
    });

    // Append files (optional)
    if (files.length > 0) {
      files.forEach((file) => formData.append('files', file)); // use key 'files'
    }

    const response = await api.post(url, formData); // let Axios set headers
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * GET Request
 */
export const getRequest = async (url, params = {}) => {
  try {
    const response = await api.get(url, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
