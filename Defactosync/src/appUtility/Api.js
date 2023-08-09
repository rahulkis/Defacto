import axios from 'axios';
import { API_BASE_URL } from '../constants/AppConst';

export const getAccessToken = () => {
  const tokens = localStorage.getItem('tokens');
  if (tokens) {
    const tokenData = JSON.parse(tokens);
    return `${tokenData.type} ${tokenData.accessToken.token}`;
  }
  return null;
};

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();  
    if (token) {
      config.headers['Authorization'] = token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    console.log('sdfdf', error);
    Promise.reject(error);
  }
);
