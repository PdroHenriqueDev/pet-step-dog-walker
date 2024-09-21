import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {logoutSerivce} from './auth';

const api = axios.create({
  baseURL: Config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const accessToken = await EncryptedStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (
      error.response &&
      [401, 403].includes(error.response.status) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = await EncryptedStorage.getItem('refreshToken');

      if (!refreshToken) return await logoutSerivce();

      try {
        const response = await axios.post(
          `${Config.API_BASE_URL}/auth/renew-token`,
          {
            refreshToken,
          },
        );

        const {accessToken: newAccessToken, refreshToken: newRefreshToken} =
          response.data.data;

        await EncryptedStorage.setItem('accessToken', newAccessToken);
        await EncryptedStorage.setItem('refreshToken', newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch {
        await logoutSerivce();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
