import axios from 'axios'
import getCookies from '../getCookie';

const api = axios.create({
    baseURL:`${import.meta.env.VITE_SERVER_URL}`
})

api.interceptors.request.use(function (config) {
  // const token = localStorage.getItem('userToken')
    const token = getCookies()
    config.headers.Authorization = token['userToken'];
    return config;
  }, function (error) {
    return Promise.reject(error);
  })

export default api