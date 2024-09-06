import {DogWalker} from '../interfaces/dogWalker';
import api from './api';

export const registerDogWalker = async (dogWalker: DogWalker): Promise<any> => {
  try {
    const response = await api.post('/dog-walker', dogWalker);
    const {data} = response;
    return data;
  } catch (error) {
    console.log('Error registering dog walker:', error);
    throw error;
  }
};
