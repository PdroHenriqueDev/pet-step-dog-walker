import api from './api';

const baseURL = '/payment';

export const balance = async (accountId: string): Promise<any> => {
  try {
    const response = await api.get(`${baseURL}/account-balance/${accountId}`);

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
