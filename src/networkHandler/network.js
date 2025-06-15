// utils/networkHandler.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_BASE_URL;

const getToken = () => localStorage.getItem('token');

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * @param {string} url - endpoint
 * @param {Object} data - query/body data
 * @param {Object} options
 *   asQueryParams: boolean — to send data as query string
 *   files: array of File — to attach as form data
 */
export const postRequest = async (url, data = {}, options = {}) => {
  const { asQueryParams = false, files = null } = options;

  try {
    if (files && files.length > 0) {
      // Handle multipart/form-data with query params
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file); // assumes field is called "files"
      });

      return (await api.post(url, formData, { params: data })).data;
    }

    if (asQueryParams) {
      // Send data in query string, no body
      return (await api.post(url, null, { params: data })).data;
    }

    // Default: send data in JSON body
    return (await api.post(url, data)).data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
