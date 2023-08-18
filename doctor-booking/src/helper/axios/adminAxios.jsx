import axios from "axios";
import getCookies from "../getCookie";

export const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}admin`,
});

adminApi.interceptors.request.use(
  function (config) {
    const token = getCookies();
    config.headers.Authorization = token["adminToken"];
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
