import EncryptedStorage from 'react-native-encrypted-storage';
import api from './api';

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<any> => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password,
      role: 'dogWalker',
    });
    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const renewToken = async (refreshToken: string): Promise<any> => {
  try {
    const response = await api.post('/auth/renew-token', {
      refreshToken,
    });
    const {data} = response;
    return data;
  } catch (error) {
    throw error;
  }
};

export const logoutSerivce = async () => {
  try {
    await EncryptedStorage.removeItem('accessToken');
    await EncryptedStorage.removeItem('refreshToken');
    await EncryptedStorage.removeItem('user');
  } catch (error) {
    throw error;
  }
};

export const removeAccount = async () => {
  try {
    const response = await api.delete('/auth/remove-account');

    const {data} = response;
    return data;
  } catch (error) {
    throw error;
  }
};
