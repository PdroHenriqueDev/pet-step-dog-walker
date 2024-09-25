import {DogWalker} from '../interfaces/dogWalker';
import api from './api';

export const registerDogWalker = async (dogWalker: DogWalker): Promise<any> => {
  try {
    const response = await api.post('/dog-walker', dogWalker);
    const {data} = response;
    return data;
  } catch (error) {
    throw error;
  }
};

export const getDogWalkerById = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/dog-walker/${id}`);
    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateDeviceToken = async (deviceToken: string): Promise<any> => {
  try {
    const response = await api.put('/notification', {
      role: 'dogWalker',
      deviceToken,
    });

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateAvailability = async ({
  isOnline,
  longitude,
  latitude,
}: {
  isOnline: boolean;
  longitude?: number;
  latitude?: number;
}): Promise<any> => {
  try {
    const response = await api.put('/dog-walker/update-availability', {
      isOnline,
      longitude,
      latitude,
    });

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const termsAcceptance = async (): Promise<any> => {
  try {
    const response = await api.post('/dog-walker/accept-terms');

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
