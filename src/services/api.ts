import axios from 'axios';
import Config from 'react-native-config';
import EncryptedStorage from 'react-native-encrypted-storage';
import {logoutSerivce} from './auth';
import {UserRole} from '../enum/role';
import {signInWithCustomToken} from 'firebase/auth';
import {auth} from '../../firebaseConfig';

// const apiUrl =
//   Platform.OS === 'ios' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';
const apiUrl = Config.API_BASE_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
        const response = await axios.post(`${apiUrl}/auth/renew-token`, {
          refreshToken,
          role: UserRole.DogWalker,
        });

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          firebaseToken,
        } = response.data.data;

        await EncryptedStorage.setItem('accessToken', newAccessToken);
        await EncryptedStorage.setItem('refreshToken', newRefreshToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        await signInWithCustomToken(auth, firebaseToken);

        return axios(originalRequest);
      } catch {
        await logoutSerivce();
      }
    }
    return Promise.reject(error);
  },
);

export default api;
