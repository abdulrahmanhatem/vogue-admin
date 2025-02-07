import axios from "axios";
import Cookies from "js-cookie"; // Import js-cookie

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API,
});

api.interceptors.request.use(async (config) => {
  const token = Cookies.get("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
