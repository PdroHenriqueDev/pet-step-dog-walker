import api from './api';

export const listBanks = async (): Promise<any> => {
  try {
    const response = await api.get('/static-data/banks');

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
