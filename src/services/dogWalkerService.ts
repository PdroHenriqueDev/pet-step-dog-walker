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
    const {data} = response;
    return data;
  } catch (error) {
    throw error;
  }
};
