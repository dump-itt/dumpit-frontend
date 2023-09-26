import axios from 'axios';
import getCookie from './getCookie';

const api = axios.create({
  baseURL: "https://dumpt.onrender.com",
});

api.interceptors.request.use(async config => {
  const token = getCookie('jwtToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;