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

export const denyRequest = async (requestId: string) => {
  try {
    const response = await api.delete(`/walk/deny/${requestId}`);

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const acceptRequest = async (requestId: string) => {
  try {
    const response = await api.post(`/walk/accept/${requestId}`);

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const cancelWalk = async (requestId: string) => {
  try {
    const response = await api.delete(`/walk/cancel/${requestId}`);

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
