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
