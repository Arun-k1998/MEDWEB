import axios from 'axios'
import getCookies from '../getCookie';

export const doctorApi = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_URL}doctor`
})

doctorApi.interceptors.request.use(
    function (config) {
        const token = getCookies();
        config.headers.Authorization = token["doctorToken"];
        return config;
      },
      function (error) {
        return Promise.reject(error);
      }
)