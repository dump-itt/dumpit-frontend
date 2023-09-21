import axios from 'axios';

const tinify = axios.create({
  baseURL: "https://api.tinify.com",
});

tinify.interceptors.request.use(async config => {
  const token = "z0Rt5WlmBgyM6NRBZhSFWCKQ7cgfbFJd";

  if (token) {
    config.headers.Authorization = `Basic ${token}`;
  }

  return config;
});

export default tinify;