import {UploadableFile} from '../interfaces/document';
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

export const updateUser = async (
  field: string,
  newValue: any,
): Promise<any> => {
  try {
    const response = await api.put('/dog-walker/update', {
      field,
      newValue,
    });

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const addAccount = async ({
  bankCode,
  accountNumber,
  agencyNumber,
  birthdate,
}: {
  bankCode: string;
  accountNumber: string;
  agencyNumber: string;
  birthdate: {day: number; month: number; year: number};
}): Promise<any> => {
  try {
    const response = await api.post('/dog-walker/add-account', {
      bankCode,
      accountNumber,
      agencyNumber,
      birthdate,
    });

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const accountPendingItems = async (): Promise<any> => {
  try {
    const response = await api.get('/dog-walker/account-requirements');

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const uploadAccountDocument = async (
  documentFile: UploadableFile,
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('document', documentFile);

    const response = await api.post('/dog-walker/account/document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const accountCheckStatus = async (): Promise<any> => {
  try {
    const response = await api.get('/dog-walker/account-status');

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};

export const uploadProfileImage = async (
  documentFile: UploadableFile,
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('profile', documentFile);

    const response = await api.post('/dog-walker/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    const {data} = response.data;
    return data;
  } catch (error) {
    throw error;
  }
};
