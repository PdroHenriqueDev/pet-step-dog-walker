import api from './api';

export const getRequestById = async (requestId: string) => {
  try {
    const response = await api.get(`/walk/request/${requestId}`);

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
