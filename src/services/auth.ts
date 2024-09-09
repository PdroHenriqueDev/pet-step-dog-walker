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
    const {data} = response;
    return data;
  } catch (error) {
    console.log('Error when login:', error);
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
    console.log('Error refreshing token:', error);
    throw error;
  }
};
